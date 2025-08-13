import { useState } from 'react'
import styles from './story.module.css'
import useTitle from '@/hooks/useTitle'

const Story = () => {
  useTitle('故事宝箱')
  // 请替换为您的真实PAT
  const patToken = import.meta.env.VITE_PAT_TOKEN
  const workflowUrl = 'https://api.coze.cn/v1/workflow/run'
  const workflowId = '7537625801082077234'

  const [userInput, setUserInput] = useState('')
  const [storyStyle, setStoryStyle] = useState('random') // 默认任意风格
  const [generatedStory, setGeneratedStory] = useState(null)
  const [status, setStatus] = useState('')
  const [isRegenerating, setIsRegenerating] = useState(false)

  // 风格选项配置
  const styleOptions = [
    { value: 'random', label: '任意风格', emoji: '🎲' },
    { value: 'fantasy', label: '奇幻冒险', emoji: '🧙‍♂️' },
    { value: 'sci-fi', label: '科幻未来', emoji: '🚀' },
    { value: 'fairy-tale', label: '经典童话', emoji: '🏰' },
    { value: 'mystery', label: '悬疑推理', emoji: '🔍' },
    { value: 'animal', label: '动物世界', emoji: '🐾' },
    { value: 'historical', label: '历史传奇', emoji: '⏳' }
  ]

  const generateStory = async (isRegenerate = false) => {
    try {
      // 验证输入
      if (!userInput.trim()) {
        setStatus('请输入关键词')
        return
      }
      
      // 设置状态
      if (isRegenerate) {
        setIsRegenerating(true)
      } else {
        setStatus('生成中...')
      }

      // 如果是任意风格，不传style参数
      const params = { user_input: userInput }
      if (storyStyle !== 'random') {
        params.story_style = storyStyle
      }

      const response = await fetch(workflowUrl, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${patToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          parameters: params
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.msg || `HTTP错误: ${response.status}`)
      }

      const result = await response.text()
      let parsedData
      try {
        parsedData = JSON.parse(result)
      } catch (e) {
        throw new Error(`响应解析失败: ${e.message}`)
      }

      if (!parsedData.data) {
        throw new Error('无效的响应格式')
      }

      const storyData = JSON.parse(parsedData.data)
      const newStory = {
        title: storyData.story_title || '未命名故事',
        content: storyData.story_content || '未能生成内容',
        style: storyStyle
      }
      
      setGeneratedStory(newStory)
      setStatus('生成成功！')
      setIsRegenerating(false)

    } catch (error) {
      console.error('生成失败:', error)
      setStatus(`错误: ${error.message}`)
      setIsRegenerating(false)
    }
  }

  const handleRegenerate = () => {
    generateStory(true)
  }

  return (
    <div className={styles.storyContainer}>
      <div className={styles.inputPanel}>
        <h2>✨ 故事宝箱 ✨</h2>
        
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="输入关键词或灵感 (例如：太空猫、魔法钥匙、会跳舞的星星...)"
          className={styles.textInput}
          rows={5}
        />

        <div className={styles.styleSelector}>
          <label>故事风格：</label>
          <select
            value={storyStyle}
            onChange={(e) => setStoryStyle(e.target.value)}
            className={styles.styleSelect}
          >
            {styleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => generateStory(false)}
          disabled={status.includes('生成')}
          className={styles.generateButton}
        >
          {status || '生成故事'}
        </button>
      </div>

      {generatedStory && (
        <div className={styles.storyCard}>
          <div className={styles.cardHeader}>
            <h3>{String(generatedStory.title)}</h3>
            <span className={styles.styleBadge}>
              {styleOptions.find(opt => opt.value === generatedStory.style)?.emoji || '📖'}
              {styleOptions.find(opt => opt.value === generatedStory.style)?.label || '故事'}
            </span>
          </div>
          
          <div className={styles.storyContent}>{generatedStory.content}</div>
          
          <button 
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={styles.regenerateButton}
          >
            {isRegenerating ? '正在生成...' : '再次生成'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Story