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
        {/* 修改这里的链接 */}
        <Link to="/creation-guide" className={styles.ctaButton}>Start exploring</Link>
        
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <i className={`fas fa-magic ${styles.featureIcon}`}></i>
            <h3>Unlimited Creativity</h3>
            <p>Unleash your imagination, create stunning works</p>
          </div>
          <div className={styles.featureItem}>
            <i className={`fas fa-users ${styles.featureIcon}`}></i>
            <h3>Community Interaction</h3>
            <p>Share inspiration with creators, grow together</p>
          </div>
          <div className={styles.featureItem}>
            <i className={`fas fa-rocket ${styles.featureIcon}`}></i>
            <h3>Quick Start</h3>
            <p>Simple tools to make creation easier</p>
          </div>
        </div>
      </div>
      <div className={styles.backgroundAnimation}></div>
    </div>
  );
};

export default Home;