import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Spin } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './ProjectChat.module.css';

SyntaxHighlighter.registerLanguage('javascript', js);

const { TextArea } = Input;
const { Text } = Typography;

const ProjectChat = ({ onAcceptCode }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', content: '欢迎来到Imagica！赶紧和我聊天实现你的应用吧。', time: '10:00' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() && !isLoading) {
      const userMsg = {
        id: messages.length + 1,
        sender: 'User',
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, userMsg]);
      setNewMessage('');
      setIsLoading(true);
      setIsTyping(true);

      try {
        const response = await fetch('http://openai-proxy.brain.loocaa.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [...messages, userMsg].map(msg => ({
              role: msg.sender.toLowerCase(),
              content: msg.content
            }))
          }),
        });

        if (!response.ok) {
          throw new Error('网络响应不正常');
        }

        const data = await response.json();
        const systemMsg = {
          id: messages.length + 2,
          sender: 'System',
          content: data.choices[0].message.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prevMessages => [...prevMessages, systemMsg]);
      } catch (error) {
        console.error('发送消息时出错:', error);
        // 这里可以添加错误处理逻辑,比如显示错误消息给用户
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    }
  };

  const handleAccept = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.content.includes('```')) {
      const codeMatch = message.content.match(/```(\w+)?\n([\s\S]*?)```/);
      if (codeMatch) {
        const [, language, code] = codeMatch;
        onAcceptCode({ language: language || 'html', code: code.trim() });
      }
    }
  };

  const renderMessageContent = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      const language = match[1] || 'javascript';
      const code = match[2].trim();
      parts.push(
        <div className={styles.codeBlockWrapper} key={match.index}>
          <div className={styles.codeBlockHeader}>
            <span>{language}</span>
          </div>
          <SyntaxHighlighter 
            language={language} 
            style={atomOneDark}
            customStyle={{
              margin: 0,
              borderRadius: '0 0 4px 4px',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card title="项目聊天" className={styles.chatBox} bodyStyle={{ padding: 0, height: '100%' }}>
      <List
        className={styles.messageList}
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={item => (
          <List.Item className={`${styles.messageItem} ${item.sender === 'User' ? styles.userMessage : styles.systemMessage}`}>
            <div className={styles.messageWrapper}>
              {item.sender === 'System' && (
                <Avatar icon={<RobotOutlined />} className={styles.avatar} />
              )}
              <div className={styles.messageContent}>
                {renderMessageContent(item.content)}
                <Text type="secondary" className={styles.messageTime}>{item.time}</Text>
                {item.sender === 'System' && item.content.includes('```') && (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    size="small"
                    className={styles.acceptButton}
                    onClick={() => handleAccept(item.id)}
                  />
                )}
              </div>
              {item.sender === 'User' && (
                <Avatar icon={<UserOutlined />} className={styles.avatar} />
              )}
            </div>
          </List.Item>
        )}
      />
      {isTyping && (
        <div className={styles.typingIndicator}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <Text style={{ marginLeft: 8 }}>AI正在思考中...</Text>
        </div>
      )}
      <div ref={messagesEndRef} />
      <div className={styles.inputArea}>
        <TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的应用设计想法..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className={styles.input}
          disabled={isLoading}
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          onClick={handleSend}
          className={styles.sendButton}
          disabled={isLoading}
        >
        </Button>
      </div>
    </Card>
  );
};

export default ProjectChat;