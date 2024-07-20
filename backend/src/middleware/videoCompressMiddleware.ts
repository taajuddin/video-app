import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import { connection } from 'mongoose';
import ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const compressVideo = (req: Request | any, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileBuffer = req.file.buffer;
  const db = connection.db;
  const bucket = new GridFSBucket(db, { bucketName: 'videos' });

  const inputBufferStream = new Readable();
  inputBufferStream.push(fileBuffer);
  inputBufferStream.push(null);

  const passThroughStream = new PassThrough();

  const ffmpegCommand = ffmpeg()
    .input(inputBufferStream)
    .outputOptions('-vf', 'scale=-1:480') // Video filter to scale to 480p height
    .format('mp4')
    .on('start', (commandLine) => {
      console.log('Spawned FFmpeg with command:', commandLine);
    })
    // .on('stderr', (stderrLine) => {
    //   console.error('FFmpeg stderr:', stderrLine);
    // });

  // Handle FFmpeg processing errors
  ffmpegCommand.on('error', (err) => {
    console.log('FFmpeg error:', err.message);
    res.status(500).send('Error processing video');
  });

  // Handle PassThrough stream errors
  passThroughStream.on('error', (err) => {
    console.log('PassThrough error:', err.message);
    res.status(500).send('Error processing file stream');
  });

  // Open upload stream to GridFS
  const uploadStream = bucket.openUploadStream(req.file.originalname);

  // Pipe FFmpeg output through PassThrough to GridFS upload stream
  ffmpegCommand.pipe(passThroughStream, { end: true });
  passThroughStream.pipe(uploadStream);

  // Handle GridFS upload finish
  uploadStream.on('finish', () => {
    req.file!.id = uploadStream.id; // Attach the file id to req.file
    next(); // Move to next middleware or route handler
  });

  // Handle GridFS upload errors
  uploadStream.on('error', (err) => {
    console.log('Upload error:', err.message);
    res.status(500).send('Error uploading file');
  });
};

export { upload, compressVideo };
