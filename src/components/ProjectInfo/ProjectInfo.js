import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Button, Row, Col } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import styles from './ProjectInfo.module.css';

const { Title } = Typography;

function geHhtmlTemplate(code) {
  return `<!doctype html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      ${code}
    </body>
    </html>`
}

const ProjectInfo = ({ project }) => {
  const navigate = useNavigate();

  const downloadCode = () => {
    if (project.code) {
      const blob = new Blob([geHhtmlTemplate(project.code.code)], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('No code available to download');
    }
  };

  return (
    <Card className={styles.projectInfo}>
      <Row gutter={[16, 0]} align="middle">
        <Col flex="auto">
          <Space direction="horizontal" size={0} align="start" style={{ width: '100%' }}>
            <Title level={5} className={styles.projectTitle}>{project.name}</Title>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={downloadCode}
            >
              Download Code
            </Button>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>Back</Button>
          </Space>
        </Col>
      </Row>
      {/* <Text type="secondary" className={styles.description}>{project.description}</Text> */}
    </Card>
  );
};

export default ProjectInfo;