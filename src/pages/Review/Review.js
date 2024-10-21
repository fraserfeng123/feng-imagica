import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout, Spin } from 'antd';
import Title from '../../components/Nodes/Title/Title';
import SubTitle from '../../components/Nodes/SubTitle/SubTitle';
import Input from '../../components/Nodes/Input/Input';
import styles from './Review.module.css';

const { Content } = Layout;

const Review = () => {
  const { id } = useParams();
  const project = useSelector((state) =>
    state.project.projects.find((p) => p.id === parseInt(id))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project) {
      setLoading(false);
    }
  }, [project]);

  if (loading) {
    return (
      <Layout className={styles.reviewLayout}>
        <Content className={styles.content}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout className={styles.reviewLayout}>
        <Content className={styles.content}>
          <h1>项目不存在</h1>
          <p>抱歉,找不到ID为 {id} 的项目。</p>
        </Content>
      </Layout>
    );
  }

  console.log(project.nodes)

  const renderNode = (node, index) => {
    switch (node.type) {
      case 'title':
        return <Title key={index} text={node.data.name} />;
      case 'subtitle':
        return <SubTitle key={index} text={node.data.name} />;
      case 'userinput':
        return <Input key={index} title={node.data.name} placeholder={node.data.description} />;
      default:
        return <Title key={index} text={node.title} />;
    }
  };

  return (
    <Layout className={styles.reviewLayout}>
      <Content className={styles.content}>
        <Title text={project.name} />
        <SubTitle text={project.description} />
        <div className={styles.previewBox}>
          {project.nodes.map((node, index) => renderNode(node, index))}
        </div>
      </Content>
    </Layout>
  );
};

export default Review;
