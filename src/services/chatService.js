export const sendMessageToAI = async (messages, userMsg) => {
  try {
    const response = await fetch('http://openai-proxy.brain.loocaa.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [...messages, userMsg].map(msg => ({
          role: msg.sender.toLowerCase(),
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      throw new Error('网络响应不正常');
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // 替换特定文字
    content = content.replace("HTML代码", "预览图");

    return content;
  } catch (error) {
    console.error('发送消息时出错:', error);
    throw error;
  }
};
