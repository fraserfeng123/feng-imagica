import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // 确保你有这个文件
import AppRouter from './router';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // 从本地存储加载项目
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(savedProjects);
  }, []);

  const handleProjectSelect = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project);
    // 这里你可以添加其他逻辑,比如导航到项目详情页面
  };

  const handleProjectDelete = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
    }
  };

  return (
    <Provider store={store}>
      <div className="App">
        <AppRouter />
      </div>
    </Provider>
  );
}

export default App;