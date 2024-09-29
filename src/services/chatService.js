let controller = null;

export const sendMessage = async (userName, userMessage, functionalityMessages = [], responseMessages = [], graphstring = "") => {
  // 取消之前的请求(如果存在)
  if (controller) {
    controller.abort();
  }

  // 创建新的 AbortController
  controller = new AbortController();

  try {
    const response = await fetch('https://api-dev.braininc.net/stream/cot/onboarding/chat', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Authorization': 'token eaa012695ec1565bed0b27d799d8bb8456c6ce75',
        'Content-Type': 'application/json',
        'Origin': 'https://dashboard.brainllc.net',
        'X-Brain-Imagica-Id': 'a33b1356-9f58-4903-ad60-eddc62f58cb8',
        'X-Brain-User-Tz': 'Asia/Shanghai'
      },
      body: JSON.stringify({
        user_name: userName,
        user_message: userMessage,
        functionality_messages: functionalityMessages,
        response_messages: responseMessages,
        graphstring: graphstring,
        stream: true
      }),
      signal: controller.signal
    });

    if (!response.body) {
      throw new Error('流响应体为空');
    }

    return response.body.getReader();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
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
