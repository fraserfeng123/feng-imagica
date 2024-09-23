let controller = null;

export const sendMessage = async (messages, newMessage) => {
  // 取消之前的请求(如果存在)
  if (controller) {
    controller.abort();
  }

  // 创建新的 AbortController
  controller = new AbortController();

  try {
    const response = await fetch('http://openai-proxy.brain.loocaa.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          ...messages.map(msg => ({
            role: msg.sender.toLowerCase() === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content: newMessage.content }
        ],
        stream: true // 启用流式返回
      }),
      signal: controller.signal
    });

    if (!response.body) {
      throw new Error('流响应体为空');
    }

    return response.body.getReader();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求被取消:', error.message);
    } else {
      throw error;
    }
  } finally {
    controller = null;
  }
};

export const cancelRequest = () => {
  if (controller) {
    controller.abort();
    controller = null;
  }
};
