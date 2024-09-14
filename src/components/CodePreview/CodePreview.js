import React from 'react';
import styles from './CodePreview.module.css';

const CodePreview = ({ code }) => {
  if (!code) {
    return <div className={styles.previewContainer}>暂无预览内容</div>;
  }

  return (
    <div className={styles.previewContainer}>
      {code.language === 'html' ? (
        <iframe
          srcDoc={`<html><body>${code.code}</body></html>`}
          title="HTML Preview"
          className={styles.previewIframe}
        />
      ) : (
        <pre>{code.code}</pre>
      )}
    </div>
  );
};

export default CodePreview;