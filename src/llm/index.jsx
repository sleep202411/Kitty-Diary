/**
 * chat 聊天
 * 
 */
const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions';
const KIM_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

// console.log(process.env.VITE_DEEPSEEK_API_KEY, '------');
export const chat = async (
    messages, 
    api_url=DEEPSEEK_CHAT_API_URL, 
    api_key=import.meta.env.VITE_DEEPSEEK_API_KEY,
    model='deepseek-chat'
) => {
    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false,
            })
        })
        const data = await response.json();
        return {
            code: 0,
            data: {
                role: 'assistant',
                content: data.choices[0].message.content
            }
            
        }
    } catch(err) {
        return {
            code: 1,
            msg: '出错了...'
        }
   } 
}

export const kimiChat = async (messages) => {
    const res = await chat(
        messages,
        KIM_CHAT_API_URL,
        import.meta.env.VITE_KIMI_API_KEY,
        'moonshot-v1-auto'
    )
    return res;
}

export const generateAvatar = async (text) => {
    // 设计prompt 
    const prompt = `
    你是一位专业的头像设计师，擅长设计可爱风格的头像。
    请根据以下用户信息设计一个头像描述，要求：
    1. 可爱甜美风格，适合年轻女性用户
    2. 包含用户个性元素
    3. 描述详细且适合转换为图像
    
    用户信息: ${text}
    
    请直接返回头像的详细文字描述，不需要任何解释或前缀。
    `;

    try {
        console.log('开始生成头像，输入文本:', text);
        // 第一步：获取头像描述
        const descriptionResponse = await kimiChat([
            { 
                role: "user",
                content: prompt
            }
        ]);
        console.log('获取头像描述响应:', descriptionResponse);

        if (descriptionResponse.code !== 0 || !descriptionResponse.data.content) {
            throw new Error('获取头像描述失败');
        }

        const avatarDescription = descriptionResponse.data.content;
        console.log('头像描述:', avatarDescription);
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarDescription)}`;
        console.log('生成的头像URL:', avatarUrl);
        return avatarUrl;
    } catch (error) {
        console.error('生成头像失败:', error);
        // 返回默认头像
        return 'https://placekitten.com/200/200';
    }
}