import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Space, Button, Row, Col, Avatar } from 'antd';
import { ArrowLeftOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import styles from './ProjectInfo.module.css';

const { Title, Text } = Typography;

const ProjectInfo = ({ project, getProjectTypeIcon }) => {
  const navigate = useNavigate();

  return (
    <Card className={styles.projectInfo}>
      <Row gutter={[16, 0]} align="middle">
        <Col flex="auto">
          <Space direction="horizontal" size={0} align="start" style={{ width: '100%' }}>
            <Title level={4} className={styles.projectTitle}>{project.name}</Title>
            <Space size="small" style={{ lineHeight: '28px' }}>
              <Tag icon={getProjectTypeIcon(project.type)} color="blue">{project.type.toUpperCase()}</Tag>
              {/* <Tag icon={<TeamOutlined />} color="green">{project.members} 成员</Tag> */}
              <Tag icon={<CalendarOutlined />} color="orange">创建于 2023-06-15</Tag>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space>
            <Avatar.Group maxCount={3}>
              {[...Array(project.members)].map((_, index) => (
                <Avatar key={index} style={{ backgroundColor: '#f56a00' }}>U</Avatar>
              ))}
            </Avatar.Group>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>返回</Button>
          </Space>
        </Col>
      </Row>
      <Text type="secondary" className={styles.description}>{project.description}</Text>
    </Card>
  );
};

export default ProjectInfo;