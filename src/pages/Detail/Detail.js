import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Button, Radio } from "antd";
import {
  MobileOutlined,
  GlobalOutlined,
  WechatOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import ProjectInfo from "../../components/ProjectInfo/ProjectInfo";
import ProjectChat from "../../components/ProjectChat/ProjectChat";
import CodePreview from "../../components/CodePreview/CodePreview";
import {
  updateProjectCode,
  updateProjectChatList,
} from "../../redux/projectSlice";
import styles from "./Detail.module.css";

const { Content, Sider } = Layout;

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) =>
    state.project.projects.find((p) => p.id === parseInt(id))
  );
  const [previewNodes, setPreviewNodes] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [selectedElement, setSelectedElement] = useState(null);
  const [projectType, setProjectType] = useState("web");

  useEffect(() => {
    if (project && project.nodes) {
      setPreviewNodes(project.nodes);
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

  const handleAcceptCode = (newCode) => {
    setPreviewNodes(newCode);
    dispatch(updateProjectCode({ id: project.id, nodes: newCode }));
  };

  const handleUpdateChatList = (newChatList) => {
    dispatch(updateProjectChatList({ id: project.id, chatList: newChatList }));
  };

  const handleElementSelect = (elementHTML) => {
    setSelectedElement(elementHTML);
  };

  const handleProjectTypeChange = (e) => {
    setProjectType(e.target.value);
  };

  const handleNodesChange = (newNodes, newTitle, newDescription) => {
    setPreviewNodes(newNodes);
    dispatch(updateProjectCode({ 
      id: project.id, 
      nodes: newNodes,
      title: newTitle,
      description: newDescription
    }));
  };

  return (
    <Layout className={styles.detailLayout}>
      <Content className={styles.content}>
        <ProjectInfo project={project} />
        <div className={styles.tabContainer}>
          {/* <button
            className={activeTab === 'preview' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            
            className={activeTab === 'code' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('code')}
          >
            Code edit
          </button> */}
          <Radio.Group
            value={projectType}
            onChange={handleProjectTypeChange}
            className={styles.projectTypeToggle}
          >
            <Radio.Button value="web">
              <DesktopOutlined />
            </Radio.Button>
            <Radio.Button value="mobile">
              <MobileOutlined />
            </Radio.Button>
          </Radio.Group>
        </div>
        <Layout className={styles.innerLayout}>
          <Content className={styles.previewArea}>
            {projectType === "mobile" ? (
              <div className={styles.iphoneModel}>
                <div className={styles.iphoneScreen}>
                  <CodePreview
                    nodes={previewNodes}
                    title={project.name}
                    description={project.description}
                    onNodesChange={handleNodesChange}
                  />
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
                  <CodePreview
                    nodes={previewNodes}
                    title={project.name}
                    description={project.description}
                    onNodesChange={handleNodesChange}
                  />
                </div>
              </div>
            )}
          </Content>
          <Sider width={500} theme="light" className={styles.chatSider}>
            <ProjectChat
              nodes={previewNodes}
              onAcceptCode={handleAcceptCode}
              initialChatList={project.chatList}
              onUpdateChatList={handleUpdateChatList}
              selectedElement={selectedElement}
              onElementSelect={handleElementSelect}
            />
          </Sider>
        </Layout>
      </Content>
    </Layout>
  );
};

export default Detail;
