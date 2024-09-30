import React, { useRef, useEffect, useState } from 'react';
import styles from './CodePreview.module.css';

const CodePreview = ({ code, onCodeChange, onElementSelect }) => {
  const previewRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = code.code;
      addEditableListeners(previewRef.current);
    }
  }, [code.code]);

  const addEditableListeners = (element) => {
    const allElements = element.getElementsByTagName('*');
    for (let el of allElements) {
      el.addEventListener('dblclick', handleDoubleClick);
      el.addEventListener('blur', handleBlur);
      el.addEventListener('keydown', handleKeyDown);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (selectedElement) {
      selectedElement.classList.remove(styles.selected);
    }
    e.target.classList.add(styles.selected);
    setSelectedElement(e.target);
    onElementSelect(e.target.outerHTML);
    e.target.contentEditable = true;
    e.target.focus();
  };

  const handleBlur = (e) => {
    e.target.contentEditable = false;
    e.target.classList.remove(styles.selected);
    setSelectedElement(null);
    onElementSelect(null);
    updateCode();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const updateCode = () => {
    if (previewRef.current) {
      const newCode = previewRef.current.innerHTML;
      onCodeChange({ ...code, code: newCode });
    }
  };

  return (
    <div className={styles.previewContainer}>
      <div
        ref={previewRef}
        className={styles.previewContent}
      />
    </div>
  );
};

export default CodePreview;