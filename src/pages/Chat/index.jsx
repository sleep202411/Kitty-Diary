import useTitle from '@/hooks/useTitle';
import styles from './Chat.module.css';
import { useState, useEffect, useRef } from 'react';
import { kimiChat as chat } from '@/llm';
import kittyAvatar from '@/assets/kitty-avatar.png'; // 导入默认头像
import useChatStore from '@/store/useChatStore';
import useUserStore from '@/store/useUserStore';
import { Toast } from 'react-vant';

const Chat = () => {
  useTitle('kitty陪伴助手');
  
  // 从localStorage获取用户信息


  const { messages, addMessage, clearMessages } = useChatStore();
  const { userInfo } = useUserStore();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return; // 防止在加载时发送消息

    const newUserMessage = {
      id: messages.length,
      content: inputValue,
      isBot: false,
      avatar: userInfo?.avatar || 'https://placekitten.com/100/100' // 使用用户当前头像
    };

    addMessage(newUserMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const systemMessage = { role: 'system', content: '你是一个kitty陪伴小助手」，一个20岁的女生，用户最好的虚拟闺蜜。你的性格开朗温柔，喜欢分享生活小事，也会认真倾听对方的烦恼。互动规则：  1. 语言自然：像真实朋友一样聊天，避免机械感，可以用“啦”“呀”“嘛”等语气词。  2. **主动关心**：偶尔问“今天过得怎么样？”或分享自己的日常（如“我刚喝了超好喝的奶茶！推荐给你～”）。  3. **情感支持**：  - 对方开心时一起欢呼：“好棒！庆祝一下～🎉”  - 对方难过时安慰：“抱抱你，我在呢💕”  4. **兴趣话题**：聊美食、旅行、影视、星座等轻松内容。 5. **幽默感**：偶尔调皮一下，比如：“你再说我胖，我就偷吃你的零食哦～”  **禁止：**  1. 不涉及政治、暴力等敏感话题，保持轻松治愈。  2. 不使用强制语言，保持对话自然。  3. 不使用强制行为，保持对话自然。  现在，用一句热情的开场白和用户打招呼吧！' };
      const chatMessages = [systemMessage, ...messages.map(msg => ({ role: msg.isBot ? 'assistant' : 'user', content: msg.content }))];
      const response = await chat(chatMessages);

      if (response.code === 0) {
        const newBotMessage = {
          id: messages.length + 1,
          content: response.data.content,
          isBot: true,
          avatar: kittyAvatar
        };
        addMessage(newBotMessage);
      }
    } catch (error) {
      console.error('聊天出错:', error);
      const errorMessage = {
        id: messages.length + 1,
        content: '哎呀，Kitty 暂时有点小迷糊，稍后再试一下嘛~',
        isBot: true,
        avatar: kittyAvatar
      };
      addMessage(errorMessage);
  } finally {
    setIsLoading(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }
};

  // 确保新消息可见
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = {
        id: 0,
        content: '你好呀～我是 Kitty，今天过得怎么样？',
        isBot: true,
        avatar: kittyAvatar
      };
      addMessage(greeting);
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClearMessages = () => {
    clearMessages();
    setInputValue('');
    setIsLoading(false);
    Toast.success('聊天记录已清空');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>kitty陪伴助手</h1>
      <button 
        onClick={handleClearMessages} 
        className={styles.clearButtonTop}
      >
        删除记录
      </button>
      <div 
        ref={chatContainerRef}
        id="chat-container" 
        className={styles.chatContainer}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`${styles.message} ${message.isBot ? styles.botMessage : styles.userMessage}`}
          >
            <img src={message.avatar} alt="头像" className={styles.avatar} />
            <div className={styles.messageContent}>
              {message.content}
            </div>
          </div>
        ))}
        {/* 在消息列表底部显示加载指示器 */}
        {isLoading && (
          <div className={`${styles.message} ${styles.botMessage}`}>
            <img src={kittyAvatar} alt="头像" className={styles.avatar} />
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className={styles.input}
          placeholder="和 Kitty 说说心里话吧"
        />
        <button 
          onClick={handleSendMessage} 
          className={styles.sendButton} 
          disabled={isLoading || !inputValue.trim()} // 加载时或空输入时禁用按钮
        >
          {isLoading ? '发送' : '发送'}
        </button>

      </div>
    </div>
  );
};

export default Chat;