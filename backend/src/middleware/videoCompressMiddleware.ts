import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const compressVideo = (req: Request, res: Response, next: NextFunction) => {
  console.log(path.join(__dirname))
  const tempDir = path.join(__dirname, '../../compressedvideos');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const fileBuffer = req.file?.buffer;
  if (!fileBuffer) {
    return res.status(400).send('No file uploaded.');
  }

  const inputFilePath = path.join(tempDir, `${uuidv4()}.mp4`);
  const outputFilePath = path.join(tempDir, `compressed_${uuidv4()}.mp4`);

  fs.writeFileSync(inputFilePath, fileBuffer);

  const ffmpegCommand = ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:480')
    .on('end', () => {
      fs.unlinkSync(inputFilePath); // Clean up original file
      req.file!.path = outputFilePath; // Attach the compressed file path to the request object
      next();
    })
    .on('error', (err) => {
      console.error('ffmpeg error:', err.message);
      fs.unlinkSync(inputFilePath); // Clean up original file
      return res.status(500).send(`ffmpeg error: ${err.message}`);
    })
    .save(outputFilePath);

  // Optionally, you can capture stdout and stderr to diagnose ffmpeg issues
  ffmpegCommand.on('stderr', (stderrLine) => {
    console.error('ffmpeg stderr:', stderrLine);
  });
};


export { upload, compressVideo };
