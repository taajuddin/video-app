import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { getVideos } from '../../api';

interface Video {
  _id: string;
  title: string;
  category: string;
  filePath: string;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const videos = await getVideos();
    setVideos(videos);
  };

  const videoPath=(videopath: string) =>{
    // console.log(path.join(__dirname, videopath))
    console.log(`../${videopath}`)
    return `../${videopath}`
  }



  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" align='center'>Videos</Typography>
      {videos.map((video) => (
        <Card key={video._id} sx={{ mb: 12 }}>
          <CardMedia
            component="video"
            controls
            autoPlay
            src={`/compressedVideos/${video.filePath}`}
          />
          <CardContent>
            <Typography variant="h5">Title:  {video.title}</Typography>
            <Typography variant="body2">Category: {video.category}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default VideoList;