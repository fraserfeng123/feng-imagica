import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, List, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './ProjectContent.module.css';

const ProjectContent = () => {
  const projects = useSelector(state => state.project.projects);
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate('/creation-guide');
  };

  return (
    <div className={styles.projectContent}>
      <div className={styles.header}>
        <h2>My Projects</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreateProject}
        >
          Create New Project
        </Button>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={projects}
        renderItem={project => (
          <List.Item>
            <Card 
              title={
                <div className={styles.cardTitle}>
                  <div 
                    className={styles.colorIndicator} 
                    style={{ backgroundColor: project.primaryColor }}
                  />
                  {project.name}
                </div>
              }
              extra={<a onClick={() => navigate(`/detail/${project.id}`)}>View</a>}
            >
              <p>{project.description}</p>
              <p>Type: {project.type === 'web' ? 'Web' : 'Mobile App'}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProjectContent;