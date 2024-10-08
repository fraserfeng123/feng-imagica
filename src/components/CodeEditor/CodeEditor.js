import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import Editor, { loader } from '@monaco-editor/react';
import styles from './CodeEditor.module.css';

// 配置 Monaco Editor 以启用 HTML 语言服务
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.30.1/min/vs' } });

const CodeEditor = ({ code, onSave }) => {
  const [editorCode, setEditorCode] = useState('');

  useEffect(() => {
    if (code) {
      setEditorCode(code);
    }
  }, [code]);

  const handleSave = () => {
    onSave({ language: 'html', code: editorCode });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editor.getAction('editor.action.formatDocument').run();

    // 启用 HTML 语言服务
    monaco.languages.html.htmlDefaults.setOptions({
      validate: true,
      format: {
        wrapLineLength: 120,
        unformatted: 'none',
      },
      suggest: {
        html5: true,
        angular1: true,
        ionic: true,
      },
    });

    // 启用实时错误检查
    monaco.editor.onDidChangeMarkers(() => {
      const model = editor.getModel();
      const markers = monaco.editor.getModelMarkers({ resource: model.uri });
      if (markers.length > 0) {
        console.log('Markers:', markers);
      }
    });
  };

  return (
    <div className={styles.editorContainer}>
      <Editor
        width="100%"
        height="94%"
        language="html"
        theme="vs-dark"
        value={editorCode}
        options={{
          automaticLayout: true,
          tabSize: 2,
          useTabStops: true,
          formatOnType: true,
          formatOnPaste: true,
          folding: true,
          showFoldingControls: 'always',
          renderWhitespace: 'all',
          wordWrap: 'on',
          wrappingIndent: 'indent',
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoIndent: 'full',
          matchBrackets: 'always',
          minimap: { enabled: false },
        }}
        onChange={(value) => setEditorCode(value || '')}
        onMount={handleEditorDidMount}
      />
      <Button type="primary" onClick={handleSave} className={styles.saveButton}>
        Save
      </Button>
    </div>
  );
};

export default CodeEditor;