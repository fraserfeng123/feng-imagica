import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';
import { createProject } from '../../redux/projectSlice';
import templates from '../../data/templates';  // 导入模板数据
import styles from './CreationGuide.module.css';

const steps = ['Platform', 'Template', 'Branding'];

const CreationGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [appName, setAppName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#00ffff');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateProject();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setSelectedTemplate(null); // Reset template selection
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleCreateProject = () => {
    const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
    const newProject = {
      id: Date.now(), // 使用时间戳作为 ID
      name: appName,
      type: selectedPlatform === 'mobile-only' ? 'mobile' : 'web',
      description: `Created using ${selectedTemplateData ? selectedTemplateData.name : 'custom'} template`,
      primaryColor,
      secondaryColor,
      code: {language: 'html', code: selectedTemplateData ? selectedTemplateData.code : null}, // 添加这行
    };

    dispatch(createProject(newProject));
    navigate(`/detail/${newProject.id}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={`${styles.platformSelection} ${styles.fadeIn}`}>
            <h2>Where do you want your users to access your app?</h2>
            <div className={styles.platformOptions}>
              <div 
                className={`${styles.platformOption} ${selectedPlatform === 'mobile-desktop' ? styles.selected : ''} ${styles.scaleOnHover}`}
                onClick={() => handlePlatformSelect('mobile-desktop')}
              >
                <DesktopOutlined className={styles.platformIcon} />
                <p>Mobile & Desktop</p>
              </div>
              <div 
                className={`${styles.platformOption} ${selectedPlatform === 'mobile-only' ? styles.selected : ''} ${styles.scaleOnHover}`}
                onClick={() => handlePlatformSelect('mobile-only')}
              >
                <MobileOutlined className={styles.platformIcon} />
                <p>Mobile Only</p>
              </div>
            </div>
          </div>
        );
      case 1:
        
        return (
          <div className={`${styles.fadeIn}`}>
            <h2>Choose a template</h2>
            <div className={styles.templateSelection}>
              <div className={styles.templateList}>
                {templates.map(template => (
                  <div 
                    key={template.id} 
                    className={`${styles.templateItem} ${selectedTemplate === template.id ? styles.selected : ''} ${styles.scaleOnHover}`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <img src={template.thumbnail} alt={template.name} />
                    <p>{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={`${styles.brandingSelection} ${styles.fadeIn}`}>
            <h2>Brand Settings</h2>
            <div className={styles.brandingForm}>
              <div className={`${styles.formGroup} ${styles.slideInFromLeft}`}>
                <label htmlFor="appName">App Name</label>
                <input
                  type="text"
                  id="appName"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Enter your app name"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.slideInFromRight}`}>
                <label htmlFor="primaryColor">Primary Color</label>
                <input
                  type="color"
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.slideInFromLeft}`}>
                <label htmlFor="secondaryColor">Secondary Color</label>
                <input
                  type="color"
                  id="secondaryColor"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.creationGuide}>
      <h1 className={styles.bounceIn}>Create Application</h1>
      <div className={styles.stepIndicator}>
        {steps.map((step, index) => (
          <div
            key={step}
            className={`${styles.step} ${index === currentStep ? styles.active : ''} ${index < currentStep ? styles.completed : ''} ${styles.fadeIn}`}
            style={{animationDelay: `${index * 0.2}s`}}
          >
            <div className={styles.stepInfo}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepName}>{step}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.stepContent}>
        {renderStepContent()}
      </div>
      <div className={`${styles.navigation} ${styles.fadeIn}`}>
        <button 
          className={`${styles.navButton} ${styles.pulseOnHover}`}
          onClick={handleBack} 
          disabled={currentStep === 0}
        >
          Back
        </button>
        <button 
          className={`${styles.navButton} ${styles.pulseOnHover}`}
          onClick={handleNext} 
          disabled={
            (currentStep === 0 && !selectedPlatform) || 
            (currentStep === 1 && !selectedTemplate) ||
            (currentStep === 2 && !appName)
          }
        >
          {currentStep === steps.length - 1 ? 'Create' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CreationGuide;