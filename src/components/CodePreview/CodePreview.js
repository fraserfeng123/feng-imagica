import React, { useState, useEffect, useRef } from "react";
import Input from "../Nodes/Input/Input";
import styles from "./CodePreview.module.css";
import Title from "../Nodes/Title/Title";
import SubTitle from "../Nodes/SubTitle/SubTitle";
import { EditOutlined, DeleteOutlined, MessageOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const CodePreview = ({ nodes = [], title = "", description = "", onNodesChange }) => {
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const previewRef = useRef(null);
  const editInputRef = useRef(null);

  const handleSelect = (index, event) => {
    event.stopPropagation();
    setSelected(index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        setSelected(null);
        setEditing(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (editing !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  const handleDelete = (index, event) => {
    event.stopPropagation();
    const newNodes = [...nodes];
    if (index === 'description') {
      onNodesChange(newNodes, title, '');
    } else if (index !== 'title') {
      newNodes.splice(index, 1);
      onNodesChange(newNodes, title, description);
    }
    setSelected(null);
  };

  const handleEdit = (index, event) => {
    event.stopPropagation();
    setEditing(index);
    if (index === 'title') {
      setEditValue(title);
    } else if (index === 'description') {
      setEditValue(description);
    } else {
      setEditValue(nodes[index].data.name);
    }
  };

  const handleEditComplete = (index) => {
    if (index === 'title') {
      onNodesChange(nodes, editValue, description);
    } else if (index === 'description') {
      onNodesChange(nodes, title, editValue);
    } else {
      const newNodes = [...nodes];
      newNodes[index] = { ...newNodes[index], data: { ...newNodes[index].data, name: editValue } };
      onNodesChange(newNodes, title, description);
    }
    setEditing(null);
    setEditValue("");
    setSelected(null); // 添加这行来清空 selected 状态
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      handleEditComplete(index);
    }
  };

  const handleMoveUp = (index, event) => {
    event.stopPropagation();
    if (typeof index === 'number' && index > 0) {
      const newNodes = [...nodes];
      [newNodes[index - 1], newNodes[index]] = [newNodes[index], newNodes[index - 1]];
      onNodesChange(newNodes, title, description);
      setSelected(index - 1);
    }
  };

  const handleMoveDown = (index, event) => {
    event.stopPropagation();
    if (typeof index === 'number' && index < nodes.length - 1) {
      const newNodes = [...nodes];
      [newNodes[index], newNodes[index + 1]] = [newNodes[index + 1], newNodes[index]];
      onNodesChange(newNodes, title, description);
      setSelected(index + 1);
    }
  };

  const nodesArray = Array.isArray(nodes) ? nodes : [];
  const userInputs = nodesArray.filter((node) => node.type === "userinput");

  const renderElement = (key, content, index) => (
    <div
      key={key}
      className={`${styles.elementWrapper} ${
        selected === index ? styles.selectedElement : ""
      }`}
      onClick={(e) => handleSelect(index, e)}
    >
      {selected === index && (
        <div className={styles.actionButtons}>
          <Tooltip title="Talk to AI">
            <MessageOutlined className={styles.actionButton} />
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlined className={styles.actionButton} onClick={(e) => handleEdit(index, e)} />
          </Tooltip>
          {index !== 'title' && (
            <Tooltip title="Delete">
              <DeleteOutlined className={styles.actionButton} onClick={(e) => handleDelete(index, e)} />
            </Tooltip>
          )}
          {typeof index === 'number' && index > 0 && (
            <Tooltip title="Turn up">
              <ArrowUpOutlined className={styles.actionButton} onClick={(e) => handleMoveUp(index, e)} />
            </Tooltip>
          )}
          {typeof index === 'number' && index < nodes.length - 1 && (
            <Tooltip title="Turn down">
              <ArrowDownOutlined className={styles.actionButton} onClick={(e) => handleMoveDown(index, e)} />
            </Tooltip>
          )}
        </div>
      )}
      {editing === index ? (
        <input
          ref={editInputRef}
          className={styles.editInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleEditComplete(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ) : (
        content
      )}
    </div>
  );

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewBox} ref={previewRef}>
        {title && renderElement("title", <Title text={title} />, "title")}
        {description && renderElement("description", <SubTitle text={description} />, "description")}
        {userInputs.map((i, index) => 
          renderElement(index, <Input title={i.data.name} placeholder={i.data.description} />, index)
        )}
      </div>
    </div>
  );
};

export default CodePreview;
