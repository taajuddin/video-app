import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import { connection } from 'mongoose';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const compressVideo = async (req: Request | any, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileBuffer = req.file.buffer;
  const db = connection.db;
  const bucket = new GridFSBucket(db, { bucketName: 'videos' });
  const tempFolder = 'temp_videos';
  const tempFileName : string = `${Date.now()}_${req.file.originalname}`;
  const tempFilePath = path.join(tempFolder, tempFileName);

  // Ensure the temp folder exists
  if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
  }

  // Write the buffer to a temporary file
  fs.writeFileSync(tempFilePath, fileBuffer);

  const compressedFileName = `compressed_${tempFileName}`;
  const compressedFilePath = path.join(tempFolder, compressedFileName);

  // Compress the video using ffmpeg
  ffmpeg(tempFilePath)
    .outputOptions('-c:v libx264')   // Use H.264 video codec
    .outputOptions('-crf 28')        // Set constant rate factor for compression (adjust as needed)
    .outputOptions('-preset fast')   // Set encoding speed to fast
    .save(compressedFilePath)
    .on('end', () => {
      console.log('Video compression completed');

      // Read the compressed file and upload to GridFS
      const compressedFileStream = fs.createReadStream(compressedFilePath);
      const uploadStream = bucket.openUploadStream(req.file.originalname);

      compressedFileStream.pipe(uploadStream);

      uploadStream.on('finish', () => {
        req.file.id = uploadStream.id;
        console.log('File uploaded successfully', uploadStream.id);

        // Clean up temporary files
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(compressedFilePath);

        next();
      });

      uploadStream.on('error', (err) => {
        console.error('Error uploading file:', err);

        // Clean up temporary files
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(compressedFilePath);

        if (!res.headersSent) {
          res.status(500).send('Error uploading file');
        }
      });
    })
    .on('error', (err) => {
      console.error('Error during video compression:', err);

      // Clean up temporary files
      fs.unlinkSync(tempFilePath);

      if (fs.existsSync(compressedFilePath)) {
        fs.unlinkSync(compressedFilePath);
      }

      if (!res.headersSent) {
        res.status(500).send('Error during video compression');
      }
    });
};

export { upload, compressVideo };