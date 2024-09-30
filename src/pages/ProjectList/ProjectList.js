import React from 'react';
import { Layout } from 'antd';
import Header from '../../components/Header/Header';
import ProjectContent from '../../components/ProjectContent/ProjectContent';
import styles from './ProjectList.module.css';

const ProjectList = () => {

  return (
    <Layout className={styles.projectListLayout}>
      <Header theme="light" />
      <Layout>
        <ProjectContent />
      </Layout>
    </Layout>
  );
};

export default ProjectList;