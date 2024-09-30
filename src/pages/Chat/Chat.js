import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, message, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Chat.module.css';
import { sendMessage, cancelRequest, getAppInfo } from '../../services/chatService';
import { useDispatch } from 'react-redux';
import { createProject } from '../../redux/projectSlice'; // 确保导入了createProject action

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [implementation, setImplementation] = useState("");
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const autoInputRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    scrollToBottom();
    
    const searchParams = new URLSearchParams(location.search);
    const autoInput = searchParams.get('autoInput');
    
    if (autoInput && !autoInputRef.current) {
      autoInputRef.current = autoInput;
      setInputValue(autoInput);
      navigate('/chat', { replace: true });
      handleSendMessage(null, autoInput);
    }
  }, [location, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e, autoInputValue = null) => {
    if (e) e.preventDefault();
    const messageToSend = autoInputValue || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage = { sender: "user", content: messageToSend };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const reader = await sendMessage("fraser", messageToSend);
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
                  setFunctions(JSON.parse(content).functions);
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
              console.log("jsonData", jsonData)
              if (jsonData.choices && jsonData.choices[0].delta.content) {
                content += jsonData.choices[0].delta.content;
              }
            } catch (error) {
              console.error('解析JSON时出错:', error, 'Raw data:', data);
              // 继续处理下一行，不中断整个过程
            }
          } else {
            console.log("-----", line)
          }
        }

        // 继续处理下一个数据块
        await processChunk();
      };

      await processChunk();
    } catch (error) {
      console.error('发送消息时出错:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'system', content: '抱歉,发生了错误。请稍后再试。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCancel = () => {
    cancelRequest();
    setIsTyping(false);
  };

  const handleMakeItReal = async () => {
    setIsLoading(true);
    try {
      setMessages(prevMessages => {
        const updatedMessages = [
          ...prevMessages, 
          { 
            sender: 'user', 
            content: `Make it real`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
        
        // 在这里执行后续操作，确保使用最新的消息列表
        (async () => {
          try {
            const appInfo = await getAppInfo(functions, implementation);
            console.log('App Info:', appInfo);
            
            // 创建新项目
            const newProject = {
              id: Date.now(), // 使用时间戳作为临时ID
              name: appInfo.name,
              description: appInfo.description,
              code: { language: 'html', code: '' }, // 初始化空代码
              features: appInfo.features,
              audience: appInfo.audience,
              goal: appInfo.goal,
              chatList: updatedMessages, // 使用更新后的消息列表
            };

            dispatch(createProject(newProject));

            // 添加一条系统消息，通知用户项目已创建
            setMessages(prevMsgs => [
              ...prevMsgs, 
              { 
                sender: 'system', 
                content: `项目 "${appInfo.name}" 已成功创建！您可以在项目列表中查看它。`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);

            // 导航到新创建的项目详情页面
            navigate(`/detail/${newProject.id}`);
          } catch (error) {
            console.error('创建项目时出错:', error);
            setMessages(prevMsgs => [
              ...prevMsgs, 
              { 
                sender: 'system', 
                content: '抱歉，创建项目时发生错误。请稍后再试。',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          } finally {
            setIsLoading(false);
          }
        })();

        return updatedMessages;
      });
    } catch (error) {
      console.error('处理 Make it real 请求时出错:', error);
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading} tip="Creating project...">
      <div className="flex flex-col h-screen bg-white text-gray-900">
        <header className="w-full flex justify-center items-center p-4">
          <h1 className="text-xl font-bold">Imagica</h1>
        </header>
        <main className="flex-grow overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className={`mb-6 max-w-2xl rounded-lg p-6 ${styles.boxShadow}`}>
              <h2 className="text-2xl font-bold">Hello 👋 Welcome to Imagic!</h2>
              <p className="mt-2">I'm Imagic, your personal website designer assistant, ready to bring your website ideas to life? Let's chat about your vision, and I'll help you build your site from the ground up, just the way you want it!</p>
            </div>
            <div className={`mb-6 max-w-2xl rounded-lg p-6 ${styles.boxShadow}`}>
              <p className="text-base font-medium">What kind of website would you like to build? 😊</p>
              <button className="mt-2 text-sm font-semibold text-gray-500">Suggestion</button>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700 border border-gray-300 rounded-lg p-2 cursor-pointer" onClick={() => handleSendMessage(null, "Travel Planner: I tell it where I want to go and how long my stay will be, and it will show me an image of my destination and then a day-by-day itinerary")}>Travel Planner: I tell it where I want to go and how long my stay will be, and it will show me an image of my destination and then a day-by-day itinerary</p>
                <p className="text-sm text-gray-700 border border-gray-300 rounded-lg p-2 cursor-pointer" onClick={() => handleSendMessage(null, "Gift Recommender: I tell it the occasion, it gives me recommendations for gifts")}>Gift Recommender: I tell it the occasion, it gives me recommendations for gifts</p>
              </div>
            </div>
            {messages.map((message, index) => (
              <div key={index} className={`mb-4`}>
                <div className={`inline-block p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : styles.boxShadow}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline ? (
                          <code className="bg-gray-100 rounded px-1" {...props} />
                        ) : (
                          <code className="block bg-gray-100 rounded p-2 my-2 whitespace-pre-wrap" {...props} />
                        ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  {(index === 1 || index === 3) && <button className="mt-2 text-sm font-semibold text-gray-500">Suggestion</button>}
                  {(index === 1 || index === 3) && (
                    <div className="mt-4 space-y-2">
                      {index === 1 && <p className={`text-xs text-gray-700 pl-4 pr-4 pt-2 pb-2 border border-gray-300 rounded-lg cursor-pointer ${styles.suggestButton}`} onClick={() => handleSendMessage(null, "check if the functions are supported")}>Continue</p>}
                      {index === 3 && <p 
                        className={`text-xs text-gray-700 pl-4 pr-4 pt-2 pb-2 border border-gray-300 rounded-lg cursor-pointer ${styles.suggestButton}`} 
                        onClick={handleMakeItReal}
                      >
                        Make it real
                      </p>}
                    </div>)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg">
                  AI is thinking...
                </div>
                <Button onClick={handleCancel}>cancel</Button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        <footer className="p-6 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Talk to your AI builder..."
              className="flex-grow p-2 rounded-l-lg bg-white text-gray-900 border border-gray-300"
              ref={inputRef}
            />
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              className={styles.roundedRight}
            />
          </form>
        </footer>
      </div>
    </Spin>
  );
};

export default Chat;