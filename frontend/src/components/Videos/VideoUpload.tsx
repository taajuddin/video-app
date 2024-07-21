import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Select, TextField, Typography } from '@mui/material';
import { uploadVideo } from '../../api';
import CheckIcon from '@mui/icons-material/Check'

const VideoUploadForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVideoUploaded, setVideoUploaded] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('category', category);

    setUploading(true);
    setProgress(0);

    try {
      await uploadVideo(formData);
      setProgress(100);
      setVideoUploaded(true)
      setCategory('')
      setFile(null)
      setTitle('')
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {isVideoUploaded && (
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
         Video Has been successfully uploaded.
       </Alert>
      )}
      <Typography variant="h6">Upload Video</Typography>
      <TextField
        label="Title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value as string)}
        required
        displayEmpty
        fullWidth
      >
        <MenuItem value="" disabled>Select Category</MenuItem>
        <MenuItem value="Animation">Animation</MenuItem>
        <MenuItem value="Slow Mo">Slow Mo</MenuItem>
        <MenuItem value="Entertainment">Entertainment</MenuItem>
        <MenuItem value="Kids">Kids</MenuItem>
        <MenuItem value="WildLife">Wild Life</MenuItem>


      </Select>

      <Button
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        disableFocusRipple
      >
        Select File
        <input
          type="file"
          hidden
          accept='video/*'
          onChange={handleFileChange}
        />
      </Button>
      {uploading && <CircularProgress value={progress} />}


      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleUpload}
        disabled={uploading}
      >
        Upload
      </Button>
    </Box>
  );
};

export default VideoUploadForm;