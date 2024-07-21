import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Grid, MenuItem, Select, Typography } from '@mui/material';
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
    fetchVideoUrls(); 
  }, [videos]);

  const fetchVideoUrls = async () => {
    const urls: { [key: string]: string } = {};
    for (const video of videos) {
      urls[video._id] = await getVideoById(video.fileId);
    }
    setVideoUrls(urls);
  };


  // fetching All the video also based on category
  const fetchVideos = async () => {
    try {
      if(category) {
        const videos = await getVideos(category);
        setVideos(videos);
      }else {
        const videos = await getVideos();
        setVideos(videos);
        const videoCategory=videos?.map((video: any) => video.category)
        setFilteredCategory(videoCategory)
      }
    } catch (error) {
      console.log('error', error)
    }
    
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" component="div">Videos</Typography>
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
      <Grid container spacing={2}>
      {videos && videos?.map((video) => (
        <Grid key={video._id} item xs={12} sm={6} md={4}>
        <Card sx={{  height: '100%' }} >
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
        </Grid>
      ))}
      </Grid>
    </Box>
  );
};

export default VideoList;