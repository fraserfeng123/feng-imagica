import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useNavigate } from 'react-router-dom';
import { Card, Space, Button, Row, Col } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import Title from "../Nodes/Title/Title";
import SubTitle from "../Nodes/SubTitle/SubTitle";
import styles from './ProjectInfo.module.css';
import Input from '../Nodes/Input/Input';

function getHtmlTemplate(nodes, title, description) {
  const nodeToHtml = (node) => {
    if (node.type === 'userinput') {
      return ReactDOMServer.renderToString(
        <Input title={node.data.name} placeholder={node.data.description} />
      );
    }
    return '';
  };

  const bodyContent = nodes.map(nodeToHtml).join('\n');

  return `<!doctype html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>${title}</title>
    </head>
    <body class="p-4">
    <div class=flex-1 p-4 pt-12">
      ${ReactDOMServer.renderToString(
        <Title text={title} />
      )}
      ${ReactDOMServer.renderToString(
        <SubTitle text={description} />
      )}
      ${bodyContent}
      </div>
    </body>
    </html>`;
}

const ProjectInfo = ({ project }) => {
  const navigate = useNavigate();

  const downloadCode = () => {
    if (project.nodes) {
      const htmlContent = getHtmlTemplate(project.nodes, project.name, project.description);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('No nodes available to download');
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
    </Card>
  );
};

export default ProjectInfo;