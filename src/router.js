import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import ProjectList from './pages/ProjectList/ProjectList';
import Detail from './pages/Detail/Detail';
import Chat from './pages/Chat/Chat';
import Review from './pages/Review/Review';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/review/:id" element={<Review />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
