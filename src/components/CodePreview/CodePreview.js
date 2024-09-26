import React, { useRef, useEffect } from 'react';
import styles from './CodePreview.module.css';

const CodePreview = ({ code, onElementSelect }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument;
      iframeDocument.open();
      
      iframeDocument.write(code.code);
      iframeDocument.close();

      iframe.onload = () => {
        const style = iframeDocument.createElement('style');
        style.textContent = `
          * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
          }
          .highlight {
            outline: 2px solid #007bff;
            outline-offset: 2px;
            transition: outline 0.3s;
          }
        `;
        iframeDocument.head.appendChild(style);

        const script = iframeDocument.createElement('script');
        script.textContent = `
          (function() {
            var currentHighlight = null;

            document.body.addEventListener('click', function(e) {
              e.preventDefault();
              if (currentHighlight) {
                currentHighlight.classList.remove('highlight');
              }

              if (currentHighlight !== e.target) {
                e.target.classList.add('highlight');
                currentHighlight = e.target;
                
                // 创建一个临时元素来复制选中的元素
                var tempElement = currentHighlight.cloneNode(true);
                // 移除 highlight 类
                tempElement.classList.remove('highlight');
                
                // 递归移除所有子元素的 highlight 类
                function removeHighlightClass(element) {
                  element.classList.remove('highlight');
                  for (var i = 0; i < element.children.length; i++) {
                    removeHighlightClass(element.children[i]);
                  }
                }
                removeHighlightClass(tempElement);
                
                window.parent.postMessage({
                  type: 'elementSelected',
                  outerHTML: tempElement.outerHTML
                }, '*');
              } else {
                currentHighlight = null;
                window.parent.postMessage({
                  type: 'elementDeselected'
                }, '*');
              }
            });
          })();
        `;
        iframeDocument.body.appendChild(script);
      };
    }
  }, [code]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'elementSelected') {
        onElementSelect(event.data.outerHTML);
      } else if (event.data.type === 'elementDeselected') {
        onElementSelect(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementSelect]);

  return (
    <div className={styles.previewContainer}>
      <iframe
        ref={iframeRef}
        title="代码预览"
        width="100%"
        height="100%"
        className={styles.previewIframe}
      />
    </div>
  );
};

export default CodePreview;