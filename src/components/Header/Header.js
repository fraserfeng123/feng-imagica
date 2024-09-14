import React from 'react';
import { Input, Space } from 'antd';
import { SearchOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import styles from './Header.module.css';

const { Search } = Input;

const Header = ({ theme = 'light' }) => {
  return (
    <header className={`${styles.header} ${styles[theme]}`}>
      <div className={styles.logoContainer}>
        <img 
          src="https://dopniceu5am9m.cloudfront.net/natural.ai/assets/svg/logo_white.svg" 
          alt="Imagica Logo" 
          className={styles.logo}
        />
      </div>
      <Search
        placeholder="搜索项目"
        onSearch={value => console.log(value)}
        style={{ width: 200 }}
        className={styles.search}
      />
      <Space size="large" className={styles.navIcons}>
        <BellOutlined className={styles.icon} />
        <UserOutlined className={styles.icon} />
      </Space>
    </header>
  );
};

export default Header;