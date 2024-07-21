import { Request, Response } from 'express';
import { Video } from '../model/videoModel';
import { AnyExpression, connection } from 'mongoose';
import { GridFSBucket, ObjectId} from 'mongodb'


const uploadVideo = async (req: Request | any, res: Response) => {
    const { title, category } = req.body;

    const video = new Video({
      title,
      category,
      fileId: req.file!.id,
    });
  

  await video.save();
  res.status(201).send(video);
};

const getVideos = async (req: Request, res: Response) => {
  const { category } = req.query;
  const videos = await Video.find(category ? { category } : {});
  res.send(videos);
};

const getVideoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'videos' });
  
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    downloadStream.pipe(res);
  };

export { uploadVideo, getVideos , getVideoById};