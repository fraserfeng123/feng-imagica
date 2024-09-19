import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import CreationGuide from './pages/CreationGuide/CreationGuide';
import ProjectList from './pages/ProjectList/ProjectList';
import Detail from './pages/Detail/Detail';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/creation-guide" element={<CreationGuide />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;