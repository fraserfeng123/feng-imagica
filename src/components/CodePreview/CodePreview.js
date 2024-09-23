import React from 'react';
import styles from './CodePreview.module.css';

const CodePreview = ({ code }) => {
  if (!code) {
    return <div className={styles.previewContainer}>
      <iframe
        srcDoc={`<html><body></body></html>`}
        title="HTML Preview"
        className={styles.previewIframe}
      />
    </div>;
  }

  return (
    <div className={styles.previewContainer}>
      {code.language === 'html' ? (
        <iframe
          srcDoc={`${code.code}`}
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