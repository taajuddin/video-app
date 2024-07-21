import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, MenuItem, Select, Typography } from '@mui/material';
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
  const [filterCategory, setFilteredCategory]=useState([])
  const [category, setCategory] = useState('');


  useEffect(() => {
    fetchVideos()
  }, [category]);

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

  // fetching All the video also based on category
  const fetchVideos = async () => {
    if(category) {
      const videos = await getVideos(category);
      setVideos(videos);
    }else {
      const videos = await getVideos();
      setVideos(videos);
      const videoCategory=videos?.map((video: any) => video.category)
      setFilteredCategory(videoCategory)
    }
    
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Videos</Typography>
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value as string)}
        required
        displayEmpty
        fullWidth
      >
        <MenuItem value="" >All Category</MenuItem>
        {filterCategory && filterCategory.map(cat =>(<MenuItem value={cat}>{cat}</MenuItem>))}
      </Select>
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