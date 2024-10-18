import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDispatch } from 'react-redux';
import { Card, Input, Button, List, Avatar, Typography, Spin, Tag } from 'antd';
import { SendOutlined, UserOutlined, CheckCircleOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { updateProjectData } from '../../redux/projectSlice';
import { sendMessage, cancelRequest, getAppInfo, buildApp } from '../../services/chatService';
import styles from './ProjectChat.module.css';

const { TextArea } = Input;
const { Text } = Typography;

const ProjectChat = ({ onAcceptCode, initialChatList, onUpdateChatList, code, themeColor, selectedElement, onElementSelect, chatInputValue, setChatInputValue, project, setPreviewLoading }) => {
  const [messages, setMessages] = useState(initialChatList.length > 0 ? initialChatList : [
    { id: 1, sender: 'system', content: 'Welcome,What would you like to build today?', time: '10:00' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [functions, setFunctions] = useState([]);
  const [implementation, setImplementation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [rollBack, setRollBack] = useState(false);
  const messagesEndRef = useRef(null);

  const dispatch = useDispatch();

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
        sender: 'user',
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, userMsg]);
      setNewMessage('');
      setIsLoading(true);
      setIsTyping(true);

      // const copyUserMsg = JSON.parse(JSON.stringify(userMsg));
      // if(messages.length === 1 && code.code.length > 0) {
      //   copyUserMsg.content = "基于已有的html代码```" + code.code + "```结合我最新的需求做修改,并且返回我完整的html代码,最新的需求是：" + userMsg.content + ",要求样式美观和现代化，网页主题色是" + themeColor;
      // } else if (rollBack) {
      //   copyUserMsg.content = "我修改了一些代码，修改后的代码是```" + code.code + "```，请使用我修改后的代码实现并返回我完整的html代码:" + userMsg.content + ",要求新增的代码样式美观和现代化，网页主题色是" + themeColor;
      // } else {
      //   copyUserMsg.content = "基于已有的html代码```" + code.code + "```实现，并返回我完整的html代码，网页要求美观和现代化，"+ themeColor +"：" + userMsg.content;
      // }

      // // 如果有选中的元素，将其添加到消息中
      // if (selectedElement) {
      //   copyUserMsg.content += "\n\n上面描述的修改只针对以下是我选中的元素，其他的代码不要变：\n```html\n" + selectedElement + "\n```";
      // }

      try {
        // 在用 sendMessage 之前清空 selectedElement
        onElementSelect(null);
        const selectedNodeId = project.nodes.find(x => x.data.name === chatInputValue)?.id ?? "";
        const selectedNodeIdName = selectedNodeId ? `editor-${selectedNodeId}` : "";
        
        const reader = await sendMessage("fraser", newMessage, [], [], project.buildResult.graphstring, chatInputValue, selectedNodeIdName);
        let content = '';
        let buffer = '';

      const processChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
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
              setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                if (newMessages[newMessages.length - 1].sender === 'system') {
                  newMessages[newMessages.length - 1].content = content;
                } else {
                  // setFunctions(JSON.parse(content).functions);
                  setImplementation(JSON.parse(content).implementation);
                  newMessages.push({ 
                    sender: 'system', 
                    content: JSON.parse(content).response, 
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  });
                }
                return newMessages;
              });
              return;
            }
            try {
              const jsonData = JSON.parse(data);
              if (jsonData.choices && jsonData.choices[0].delta.content) {
                content += jsonData.choices[0].delta.content;
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

  const handleMakeItReal = async () => {
    setPreviewLoading(true);
    try {
      const updatedMessages = [
        ...messages, 
        { 
          sender: 'user', 
          content: `Update the app`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(updatedMessages);

      const appInfo = await getAppInfo(project.functions, implementation);
      console.log('App Info:', appInfo);
      
      const buildResult = await buildApp("check if the functions are supported", implementation, project.functions, project.buildResult.graphstring);
      console.log('Build Result:', buildResult);

      // 更新项目
      const newProject = {
        id: project.id,
        name: appInfo.name,
        description: appInfo.description,
        nodes: buildResult.graph.nodes,
        features: appInfo.features,
        audience: appInfo.audience,
        goal: appInfo.goal,
        chatList: updatedMessages,
        buildResult: buildResult,
      };

      dispatch(updateProjectData(newProject));

      setMessages(prevMsgs => [
        ...prevMsgs, 
        { 
          sender: 'system', 
          content: `I've updated your app.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      console.error('更新项目时出错:', error);
      setMessages(prevMsgs => [
        ...prevMsgs, 
        { 
          sender: 'system', 
          content: `Failed to update your app.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setPreviewLoading(false);
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
    return (
      <ReactMarkdown
        // components={{
        //   code({node, inline, className, children, ...props}) {
        //     const match = /language-(\w+)/.exec(className || '')
        //     return !inline && match ? (
        //       <SyntaxHighlighter
        //         style={atomDark}
        //         language={match[1]}
        //         PreTag="div"
        //         {...props}
        //       >
        //         {String(children).replace(/\n$/, '')}
        //       </SyntaxHighlighter>
        //     ) : (
        //       <code className={className} {...props}>
        //         {children}
        //       </code>
        //     )
        //   }
        // }}
      >
        {content}
      </ReactMarkdown>
    );
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

  const handleClearChatInputValue = () => {
    setChatInputValue('');
  };

  return (
    <Card title="Chat" className={styles.chatBox} bodyStyle={{ padding: 0, height: '100%' }}>
      <List
        className={styles.messageList}
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={item => (
          <List.Item className={`${styles.messageItem} ${item.sender === 'user' ? styles.userMessage : styles.systemMessage}`}>
            <div className={styles.messageWrapper}>
              {item.sender === 'system' && (
                <video src="https://dopniceu5am9m.cloudfront.net/static/230614_ai_listen/ASSET_AI_1_loop.mp4" className={styles.avatar} />
              )}
              <div className={styles.messageContent}>
                {renderMessageContent(item.content)}
                {item.sender === 'system' && item.content.includes('Would you like to update the app') && (
                  <Button
                    type="primary"
                    size="small"
                    className={`text-xs text-gray-700 pl-4 pr-4 pt-2 pb-2 border border-gray-300 rounded-lg cursor-pointer ${styles.suggestButton}`}
                    onClick={() => handleMakeItReal()}
                  >
                    Update
                  </Button>
                )}
              </div>
              {item.sender === 'user' && (
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
        {chatInputValue && (
          <Tag 
            className={styles.chatInputTag}
            closable
            color="#2db7f5"
            onClose={handleClearChatInputValue}
            closeIcon={<CloseOutlined />}
          >
            {chatInputValue}
          </Tag>
        )}
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