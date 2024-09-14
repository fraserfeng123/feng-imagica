import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Row, Col, Button, Avatar, Space } from 'antd';
import { EllipsisOutlined, PlusOutlined, GlobalOutlined, WechatOutlined, MobileOutlined } from '@ant-design/icons';
import { openModal } from '../../redux/projectSlice';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import styles from './ProjectContent.module.css';

const { Content } = Layout;
const { Meta } = Card;

const ProjectContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector(state => state.project);

  const showModal = () => {
    dispatch(openModal());
  };

  const handleProjectClick = (id) => {
    navigate(`/detail/${id}`);
  };

  const getProjectTypeIcon = (type) => {
    switch(type) {
      case 'web':
        return <GlobalOutlined />;
      case 'wechat':
        return <WechatOutlined />;
      case 'mobile':
        return <MobileOutlined />;
      default:
        return null;
    }
  };

  return (
    <Layout className={styles.contentLayout}>
      <Content className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>所有项目</h1>
          <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>新建项目</Button>
        </div>
        <Row gutter={[16, 16]}>
          {projects.map((project) => (
            <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
              <Card
                cover={
                  <div className={styles.cardCover}>
                    <Avatar.Group
                      maxCount={2}
                      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                    >
                      {[...Array(project.members)].map((_, index) => (
                        <Avatar key={index} style={{ backgroundColor: '#f56a00' }}>U</Avatar>
                      ))}
                    </Avatar.Group>
                  </div>
                }
                actions={[
                  <EllipsisOutlined key="ellipsis" />,
                ]}
                onClick={() => handleProjectClick(project.id)}
              >
                <Meta
                  title={
                    <Space>
                      {getProjectTypeIcon(project.type)}
                      {project.name}
                    </Space>
                  }
                  description={project.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <CreateProjectModal />
      </Content>
    </Layout>
  );
};

export default ProjectContent;