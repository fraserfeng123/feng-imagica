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

export const getAppInfo = async (functions, implementation) => {
  try {
    const response = await fetch('https://api-dev.braininc.net/be/cot/onboarding/app_info', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Authorization': 'token eaa012695ec1565bed0b27d799d8bb8456c6ce75',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'https://dashboard.brainllc.net',
        'X-Brain-Imagica-Id': '8132510e-9f0c-4881-996b-303b78502d01',
        'X-Brain-User-Tz': 'Asia/Shanghai'
      },
      body: JSON.stringify({
        functions: functions,
        implementation: implementation
      })
    });

    if (!response.ok) {
      throw new Error('网络响应不正常');
    }

    return await response.json();
  } catch (error) {
    console.error('获取应用信息时出错:', error);
    throw error;
  }
};

export const chatToAI = async (messages, newMessage) => {
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
      console.log('请求被取消');
    } else {
      throw error;
    }
  } finally {
    controller = null;
  }
}
