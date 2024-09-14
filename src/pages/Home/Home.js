import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <img 
          src="https://dopniceu5am9m.cloudfront.net/natural.ai/assets/svg/logo_white.svg" 
          alt="Imagica Logo" 
          className={styles.logo}
        />
        <h1>Welcome to <span className={styles.highlight}>Imagica</span></h1>
        <p>Where imagination meets reality</p>
        <Link to="/projects" className={styles.ctaButton}>Start exploring</Link>
      </div>
      <div className={styles.backgroundAnimation}></div>
    </div>
  );
};

export default Home;