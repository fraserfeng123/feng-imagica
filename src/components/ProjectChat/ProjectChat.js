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
      if (newMessage.trim().toLowerCase() === 'sounds good') {
        copyUserMsg.content = "请返回完整的html代码，并使用http://openai-proxy.brain.loocaa.com/v1/chat/completions接口对接,接口请求头使用'Authorization': `Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK`，接口的参数只有messages、model和stream三个字段，stream的值是true,model的值是`gpt-3.5-turbo`，messages是一个数组，数组里是对象，第一项的content应该是描述用户输入的内容，再加上应用的目的是什么，连接成一个字符串，第一项目的role是user,将这些参数传递给openAI接口，接口是流式返回的, 会返回很多次数据，直到返回的数据中包含DONE代表返回结束，每次返回的是一个字符串，每次需要使用正则表达式将字符串中的content的值取出来和之前返回的内容拼接起来当作输出结果，显示在网页上，并且不要使用while来处理逻辑，因为while处理的逻辑会导致数据丢失，要求网页样式美观和现代化和功能可以供用户使用，网页主题色是" + themeColor + "流式返回的数据处理逻辑可以参考下面的格式：```const reader = response.body.getReader();// 读取数据的函数  function read() {  return reader.read().then(({ done, value }) => {  if (done) {  console.log('读取完成'); return;  } console.log(value); // 继续读取 read(); }).catch(err => { console.error('读取失败:', err);});} // 开始读取 read();  ```这样的格式,其中打印的value就是每次返回的字符串";
      } else {
        copyUserMsg.content = "请根据以下需求返回应用的基本设计结构：" + userMsg.content;
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

  const handleClearChat = () => {
    setMessages(messages.slice(0, 1));
  }

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
      {
        <div className={styles.typingIndicator}>
          {isTyping && (
            <div className={styles.typingIndicator}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <Text style={{ marginLeft: 8 }}>AI is thinking...</Text>
              <Button onClick={handleCancel} style={{ marginLeft: 8 }}>Cancel Generation</Button>
            </div>
          )}
          {/* <Button 
            type="text" 
            onClick={handleClearChat}
            className={styles.sendButton}
          >
            clear
          </Button> */}
        </div>
      }
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