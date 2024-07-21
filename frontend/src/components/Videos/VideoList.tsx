import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { getVideos, getVideoById } from '../../api';

interface Video {
  _id: string;
  title: string;
  category: string;
  fileId: string;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchVideos = async () => {
      const videos = await getVideos();
      setVideos(videos);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchVideoUrls = async () => {
      const urls: { [key: string]: string } = {};
      for (const video of videos) {
        urls[video._id] = await getVideoById(video.fileId);
      }
      setVideoUrls(urls);
    };

    fetchVideoUrls();
  }, [videos]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Videos</Typography>
      {videos && videos?.map((video) => (
        <Card key={video._id} sx={{ mb: 2 }}>
          <CardMedia
            component="video"
            controls
            autoPlay={true}
            src={videoUrls[video._id]}
          />
          <CardContent>
            <Typography variant="h5">{video.title}</Typography>
            <Typography variant="body2">{video.category}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default VideoList;