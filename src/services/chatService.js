import axios from 'axios';

let cancelTokenSource = null;

export const sendMessage = async (messages, newMessage) => {
  // 取消之前的请求(如果存在)
  if (cancelTokenSource) {
    cancelTokenSource.cancel('用户取消了请求');
  }

  // 创建新的取消令牌
  cancelTokenSource = axios.CancelToken.source();

  try {
    const response = await axios.post('http://openai-proxy.brain.loocaa.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        ...messages.map(msg => ({
          role: msg.sender.toLowerCase() === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: newMessage.content }
      ]
    }, {
      headers: {
        'Authorization': `Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK`,
        'Content-Type': 'application/json'
      },
      cancelToken: cancelTokenSource.token
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('请求被取消:', error.message);
    } else {
      throw error;
    }
  } finally {
    cancelTokenSource = null;
  }
};

export const cancelRequest = () => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel('用户手动取消了请求');
    cancelTokenSource = null;
  }
};
