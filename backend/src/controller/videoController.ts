import { Request, Response } from 'express';
import { Video } from '../model/videoModel';

const uploadVideo = async (req: Request, res: Response) => {
    const { title, category } = req.body;
    const video = new Video({
      title,
      category,
      filePath: req.file!.path,
    });
  

  await video.save();
  res.status(201).send(video);
};

const getVideos = async (req: Request, res: Response) => {
  const { category } = req.query;
  const videos = await Video.find(category ? { category } : {});
  res.send(videos);
};

export { uploadVideo, getVideos };