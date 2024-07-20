import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import VideoUploadForm from './components/Videos/VideoUpload';
import VideoList from './components/Videos/VideoList';
import Header from './components/Headers/Header';

const App: React.FC = () => {
  return (
    <div style={{justifyContent:'center'}}>
    <Router>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<VideoUploadForm />} />
          <Route path="/videos" element={<VideoList />} />
        </Routes>
      </Container>
    </Router>
    </div>
  );
};

export default App;