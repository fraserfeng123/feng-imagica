import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout } from 'antd';
import { MobileOutlined, GlobalOutlined, WechatOutlined } from '@ant-design/icons';
import ProjectInfo from '../../components/ProjectInfo/ProjectInfo';
import ProjectChat from '../../components/ProjectChat/ProjectChat';
import CodePreview from '../../components/CodePreview/CodePreview';
import { updateProjectCode, updateProjectChatList } from '../../redux/projectSlice';
import styles from './Detail.module.css';

const { Content, Sider } = Layout;

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector(state => 
    state.project.projects.find(p => p.id === parseInt(id))
  );
  const [previewCode, setPreviewCode] = useState(null);

  useEffect(() => {
    if (project && project.code) {
      setPreviewCode(project.code);
    }
  }, [project]);

  if (!project) {
    return (
      <Layout className={styles.detailLayout}>
        <Content className={styles.content}>
          <h1>项目不存在</h1>
          <p>抱歉，找不到ID为 {id} 的项目。</p>
        </Content>
      </Layout>
    );
  }

  const isMobileProject = project.type === 'mobile' || project.type === 'wechat';

  const getProjectTypeIcon = (type) => {
    switch(type) {
      case 'web': return <GlobalOutlined />;
      case 'wechat': return <WechatOutlined />;
      case 'mobile': return <MobileOutlined />;
      default: return null;
    }
  };

  const handleAcceptCode = (newCode) => {
    setPreviewCode(newCode);
    dispatch(updateProjectCode({ id: project.id, code: newCode }));
  };

  const handleUpdateChatList = (newChatList) => {
    dispatch(updateProjectChatList({ id: project.id, chatList: newChatList }));
  };

  return (
    <Layout className={styles.detailLayout}>
      <Content className={styles.content}>
        <ProjectInfo project={project} getProjectTypeIcon={getProjectTypeIcon} />
        <Layout className={styles.innerLayout}>
          <Content className={styles.previewArea}>
            {isMobileProject ? (
              <div className={styles.iphoneModel}>
                <div className={styles.iphoneScreen}>
                  <div className={styles.appPreview}>
                    {previewCode ? (
                      <CodePreview code={previewCode} />
                    ) : (
                      <>
                        <h2>项目预览</h2>
                        <p>{project.description}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.iphoneNotch}></div>
              </div>
            ) : (
              <div className={styles.browserModel}>
                <div className={styles.browserToolbar}>
                  <span className={styles.browserButton}></span>
                  <span className={styles.browserButton}></span>
                  <span className={styles.browserButton}></span>
                </div>
                <div className={styles.browserContent}>
                  {previewCode ? (
                    <CodePreview code={previewCode} />
                  ) : (
                    <>
                      <h2>项目预览</h2>
                      <p>{project.description}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </Content>
          <Sider width={500} theme='light' className={styles.chatSider}>
            <ProjectChat 
              onAcceptCode={handleAcceptCode} 
              initialChatList={project.chatList}
              onUpdateChatList={handleUpdateChatList}
            />
          </Sider>
        </Layout>
      </Content>
    </Layout>
  );
};

export default Detail;