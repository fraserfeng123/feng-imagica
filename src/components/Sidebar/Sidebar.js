import React from 'react';
import { Layout, Menu } from 'antd';
import { FolderOutlined, StarOutlined, TeamOutlined } from '@ant-design/icons';
import styles from './Sidebar.module.css';

const { Sider } = Layout;

const Sidebar = ({ theme = 'light' }) => {
  return (
    <Sider width={200} theme={theme} className={styles.sidebar}>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
        theme={theme}
        className={styles.menu}
      >
        <Menu.Item key="1" icon={<FolderOutlined />} className={styles.menuItem}>
          所有项目
        </Menu.Item>
        <Menu.Item key="2" icon={<StarOutlined />} className={styles.menuItem}>
          我的收藏
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined />} className={styles.menuItem}>
          我的团队
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;