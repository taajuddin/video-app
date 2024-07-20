import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Video Upload and View App
        </Typography>
        <Box>
        <Button color="inherit" component={Link} to="/videos">
            View Videos
          </Button>
          <Button color="inherit" component={Link} to="/">
            Upload Video
          </Button>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;