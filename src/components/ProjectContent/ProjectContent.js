import React from 'react';
import { List, Card, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { updateProject } from '../../redux/projectSlice';
import { useNavigate } from 'react-router-dom';
import styles from './ProjectContent.module.css';

const ProjectContent = ({ onProjectSelect }) => {
  const projects = useSelector(state => state.project.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate('/creation-guide');
  };

  const handleDelete = (e, projectId) => {
    e.stopPropagation(); // 阻止事件冒泡到卡片的点击事件
    dispatch(updateProject({
      id: projectId,
      _delete: true
    }));
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
        renderItem={item => (
          <List.Item>
            <Card 
              title={
                <div className={styles.cardTitle}>
                  <div 
                    className={styles.colorIndicator} 
                    style={{ backgroundColor: item.primaryColor }}
                  />
                  {item.name}
                </div>
              }
              extra={
                <span>
                  <a onClick={() => navigate(`/detail/${item.id}`)}>View</a>
                  <span
                    className={styles.deleteButton}
                    onClick={(e) => handleDelete(e, item.id)}
                  >
                    Delete
                  </span>
                </span>
              }
            >
              <p>{item.description}</p>
              <p>Type: {item.type === 'web' ? 'Web' : 'Mobile App'}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProjectContent;