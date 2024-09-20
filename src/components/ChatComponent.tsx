import React, { useState } from 'react';
import { sendMessage, cancelRequest } from '../services/chatService';

const ChatComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await sendMessage(message);
      // 处理响应
    } catch (error) {
      // 处理错误
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    cancelRequest();
    setIsLoading(false);
  };

  return (
    <div>
      {/* 其他聊天组件 */}
      {isLoading && (
        <button onClick={handleCancel}>
          取消请求
        </button>
      )}
    </div>
  );
};

export default ChatComponent;