import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config as dotEnvConfig } from 'dotenv';
import path from 'path';
import { videoRouter } from './src/routes/videoRoutes';

dotEnvConfig();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/videos", {
  })
  .then(() => {
    console.log("database connected");
  })
  .catch(err => {
    console.log("Could not connect", err);
  });

app.use('/api/videos', videoRouter);
// console.log('pathName', path.join(__dirname, 'compressedVideos'))
app.use('/compressedVideos', express.static(path.resolve(__dirname, 'compressedVideos')));



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


