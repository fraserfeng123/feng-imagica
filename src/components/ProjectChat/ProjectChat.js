import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Spin } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './ProjectChat.module.css';
import { sendMessage, cancelRequest } from '../../services/chatService';

SyntaxHighlighter.registerLanguage('javascript', js);

const { TextArea } = Input;
const { Text } = Typography;

const ProjectChat = ({ onAcceptCode, initialChatList, onUpdateChatList, code, themeColor }) => {
  const [messages, setMessages] = useState(initialChatList.length > 0 ? initialChatList : [
    { id: 1, sender: 'System', content: 'Welcome,What would you like to build today?', time: '10:00' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [rollBack, setRollBack] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    onUpdateChatList(messages);
  }, [messages, onUpdateChatList]);

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

      const copyUserMsg = JSON.parse(JSON.stringify(userMsg));
      if(messages.length === 1 && code.code.length > 0) {
        copyUserMsg.content = "基于已有的html代码```" + code.code + "```结合我最新的需求做修改,并且返回我完整的html代码,最新的需求是：" + userMsg.content + ",要求样式美观和现代化，网页主题色是" + themeColor;
      } else if(rollBack) {
        copyUserMsg.content = "我修改了一些代码，修改后的代码是```" + code.code + "```，请使用我修改后的代码实现并返回我完整的html代码:" + userMsg.content + ",要求新增的代码样式美观和现代化，网页主题色是" + themeColor;
      } else {
        copyUserMsg.content = "请使用html实现并返回我完整的html代码，网页要求美观和现代化，网页主题色使用"+ themeColor +"：" + userMsg.content;
      }

      try {
        const reader = await sendMessage(messages, copyUserMsg);
        let content = '';
        let systemMessageAdded = false;
        let buffer = '';

        const processChunk = async () => {
          const { done, value } = await reader.read();
          if (done) {
            setIsLoading(false);
            setIsTyping(false);
            return;
          }

          const chunk = new TextDecoder().decode(value);
          buffer += chunk;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';  // 保留最后一行（可能不完整）

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(5).trim();
              if (data === '[DONE]') {
                setIsLoading(false);
                setIsTyping(false);
                return;
              }
              try {
                const jsonData = JSON.parse(data);
                if (jsonData.choices && jsonData.choices[0].delta.content) {
                  content += jsonData.choices[0].delta.content;
                  
                  setMessages(prevMessages => {
                    if (!systemMessageAdded) {
                      systemMessageAdded = true;
                      return [...prevMessages, { 
                        id: prevMessages.length + 1, 
                        sender: 'System', 
                        content: content, 
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      }];
                    } else {
                      return prevMessages.map((msg, index) => {
                        if (index === prevMessages.length - 1) {
                          return { ...msg, content: content };
                        }
                        return msg;
                      });
                    }
                  });
                }
              } catch (error) {
                console.error('解析JSON时出错:', error, 'Raw data:', data);
                // 继续处理下一行，不中断整个过程
              }
            }
          }

          // 继续处理下一个数据块
          await processChunk();
        };

        await processChunk();
      } catch (error) {
        if (error.message !== 'Request canceled') {
          console.error('发送消息时出错:', error);
          // 这里可以添加错误处理逻辑,比如显示错误消息给用户
        }
      } finally {
        setIsLoading(false);
        setIsTyping(false);
        setRollBack(false);
      }
    }
  };

  const handleAccept = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    const isLastIndex = messages[messages.length - 1].id === messageId;
    if (message && message.content.includes('```')) {
      const codeMatch = message.content.match(/```(\w+)?\n([\s\S]*?)```/);
      if (codeMatch) {
        const [, language, code] = codeMatch;
        onAcceptCode({ language: language || 'html', code: code.trim() });
        setRollBack(!isLastIndex);
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
      const language = match[1] || 'html';
      const code = match[2].trim();
      parts.push(
        <div className={styles.codeBlockWrapper} key={match.index}>
          <div className={styles.codeBlockHeader}>
            <span>{language}</span>
          </div>
          {language === 'html' ? (
            <iframe
              srcDoc={`<html><body>${code}</body></html>`}
              title="HTML Preview"
              className={styles.codePreviewIframe}
            />
          ) : (
            <pre className={styles.codeBlock}>{code}</pre>
          )}
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

  const handleCancel = () => {
    cancelRequest();
    setIsLoading(false);
    setIsTyping(false);
  };

  return (
    <Card title="Chat" className={styles.chatBox} bodyStyle={{ padding: 0, height: '100%' }}>
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
                  >
                  </Button>
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
          <Text style={{ marginLeft: 8 }}>AI is thinking...</Text>
          <Button onClick={handleCancel} style={{ marginLeft: 8 }}>Cancel Generation</Button>
        </div>
      )}
      <div ref={messagesEndRef} />
      <div className={styles.inputArea}>
        <TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Please enter your message here"
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