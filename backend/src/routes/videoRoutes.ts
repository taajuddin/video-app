import { Router } from 'express';
import { upload, compressVideo } from '../middleware/videoCompressMiddleware';
import { getVideos, uploadVideo, getVideoById } from '../controller/videoController';

const videoRouter = Router();

videoRouter.post('/upload', upload.single('video'), compressVideo, uploadVideo);
videoRouter.get('/', getVideos);
videoRouter.get('/:id', getVideoById)

export { videoRouter };
