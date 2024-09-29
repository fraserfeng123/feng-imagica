import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styles from './Chat.module.css'; // 引入CSS模块

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const autoInputRef = useRef(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e, autoInputValue = null) => {
    if (e) e.preventDefault();
    const messageToSend = autoInputValue || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage = { type: 'user', content: messageToSend };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 这里应该是发送消息到AI并获取回复的逻辑
    // 暂时用setTimeout模拟AI回复
    setTimeout(() => {
      const aiMessage = { type: 'ai', content: `你说: "${messageToSend}". 这是AI的回复。` };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="w-full flex justify-center items-center p-6">
        <h1 className="text-xl font-bold">Imagica</h1>
      </header>
      <main className="flex-grow overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className={`mb-6 max-w-2xl rounded-lg p-6 ${styles.boxShadow}`}>
            <h2 className="text-2xl font-bold">Hello 👋 Welcome to Wegic!</h2>
            <p className="mt-2">I’m Kimmy, your personal website designer assistant, ready to bring your website ideas to life? Let’s chat about your vision, and I’ll help you build your site from the ground up, just the way you want it!</p>
          </div>
          <div className={`mb-6 max-w-2xl rounded-lg p-6 ${styles.boxShadow}`}>
            <p className="text-base font-medium">What kind of website would you like to build? 😊</p>
            <button className="mt-2 text-sm font-semibold text-gray-500">Suggestion</button>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-700 border border-gray-300 rounded-lg p-2">Travel Planner: I tell it where I want to go and how long my stay will be, and it will show me an image of my destination and then a day-by-day itinerary</p>
              <p className="text-sm text-gray-700 border border-gray-300 rounded-lg p-2">Gift Recommender: I tell it the occasion, it gives me recommendations for gifts</p>
            </div>
          </div>
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-900">
                AI正在输入...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="p-6">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的消息..."
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
  );
};

export default Chat;