import React, { useState, useRef, useEffect } from 'react';
import styles from './Diary.module.css';
import useDiaryStore from '@/store/useDiaryStore';
import AppHeader from '@/components/AppHeader';
import { ArrowLeft, Plus, Edit, Delete, Success } from '@react-vant/icons';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import useTitle from '@/hooks/useTitle';

const Diary = () => {
  useTitle('我的日记箱');
  const navigate = useNavigate();
  const { diaries, addDiary, deleteDiary, updateDiary } = useDiaryStore();
  const [content, setContent] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [images, setImages] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editEmoji, setEditEmoji] = useState('😊');
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const editTextareaRef = useRef(null);

  // 自动调整文本区域高度
  useEffect(() => {
    const adjustHeight = (ref) => {
      if (ref.current) {
        ref.current.style.height = 'auto';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    };
    
    adjustHeight(textareaRef);
    adjustHeight(editTextareaRef);
  }, [content, editContent]);

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  // 删除图片
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // 提交日记
  const handleSubmit = () => {
    if (!content.trim()) return;
    
    const newDiary = {
      id: Date.now(),
      date: new Date(),
      content,
      emoji: selectedEmoji,
      images: [...images]
    };
    
    addDiary(newDiary);
    setContent('');
    setImages([]);
    setSelectedEmoji('😊');
  };

  // 开始编辑日记
  const startEditing = (diary, e) => {
    e.stopPropagation();
    setEditingId(diary.id);
    setEditContent(diary.content);
    setEditEmoji(diary.emoji);
  };

  // 保存编辑
  const saveEdit = (e) => {
    e.stopPropagation();
    if (!editContent.trim()) return;
    
    updateDiary(editingId, {
      content: editContent,
      emoji: editEmoji,
      date: new Date() // 更新修改时间
    });
    
    setEditingId(null);
    setEditContent('');
    setEditEmoji('😊');
  };

  // 取消编辑
  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  // 格式化日期
  const formatDate = (date) => {
    const d = new Date(date);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`;
  };

  return (
    <div className={styles.container}>
      
        <ArrowLeft className={styles.backButton} onClick={() => navigate(-1)} />
        <AppHeader title="日记箱" />

      {/* 写日记区域 */}
      <div className={styles.editorContainer}>
        <div className={styles.emojiSelector}>
          <span 
            className={styles.selectedEmoji}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            {selectedEmoji}
          </span>
          {showEmojiPicker && (
            <div className={styles.emojiPickerWrapper}>
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setSelectedEmoji(emojiData.emoji);
                  setShowEmojiPicker(false);
                }}
                width={300}
                height={400}
              />
            </div>
          )}
        </div>
        
        <textarea
          ref={textareaRef}
          className={styles.diaryInput}
          placeholder="今天发生了什么有趣的事情呢？"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        
        {/* 图片预览 */}
        {images.length > 0 && (
          <div className={styles.imagePreview}>
            {images.map((img, index) => (
              <div key={index} className={styles.imageItem}>
                <img src={img} alt={`预览 ${index}`} />
                <button 
                  className={styles.removeImageBtn}
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* 操作按钮 */}
        <div className={styles.actionButtons}>
          <button 
            className={styles.uploadButton}
            onClick={() => fileInputRef.current.click()}
          >
            <span>添加图片</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
          </button>
          
          <button 
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            <Plus fontSize={30} />
            <span>保存日记</span>
          </button>
        </div>
      </div>

      {/* 历史日记列表 */}
      <div className={styles.diaryList}>
        <h2 className={styles.listTitle}>我的日记</h2>
        
        {diaries.length === 0 ? (
          <div className={styles.emptyState}>
            <img src="@/assets/empty-diary.png" alt="暂无日记" />
            <p>还没有日记哦，快写下第一篇吧～</p>
          </div>
        ) : (
          diaries.map(diary => (
            <div 
              key={diary.id} 
              className={`${styles.diaryItem} ${expandedId === diary.id ? styles.expanded : ''}`}
              onClick={() => editingId !== diary.id && setExpandedId(expandedId === diary.id ? null : diary.id)}
            >
              {editingId === diary.id ? (
                <>
                  <div className={styles.editHeader}>
                    <span className={styles.editEmoji} onClick={(e) => {
                      e.stopPropagation();
                      setShowEditEmojiPicker(!showEditEmojiPicker);
                    }}>
                      {editEmoji}
                    </span>
                    {showEditEmojiPicker && (
                      <div className={styles.emojiPickerWrapper}>
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setEditEmoji(emojiData.emoji);
                            setShowEditEmojiPicker(false);
                          }}
                          width={300}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                  
                  <textarea
                    ref={editTextareaRef}
                    className={styles.diaryInput}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <div className={styles.editActions}>
                    <button 
                      className={styles.cancelEditBtn}
                      onClick={cancelEdit}
                    >
                      取消
                    </button>
                    <button 
                      className={styles.saveEditBtn}
                      onClick={saveEdit}
                      disabled={!editContent.trim()}
                    >
                      <Success fontSize={30} /> 保存
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.diaryHeader}>
                    <span className={styles.diaryDate}>{formatDate(diary.date)}</span>
                    <span className={styles.diaryEmoji}>{diary.emoji}</span>
                  </div>
                  
                  <div className={styles.diaryContent}>
                    {expandedId === diary.id ? (
                      <>
                        <p>{diary.content}</p>
                        {diary.images?.length > 0 && (
                          <div className={styles.diaryImages}>
                            {diary.images.map((img, index) => (
                              <img key={index} src={img} alt={`日记图片 ${index}`} />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className={styles.diaryPreview}>
                        {diary.content.length > 30 
                          ? `${diary.content.substring(0, 30)}...` 
                          : diary.content}
                      </p>
                    )}
                  </div>
                  
                  {expandedId === diary.id && (
                    <div className={styles.diaryActions}>
                      <button 
                        className={styles.editBtn}
                        onClick={(e) => startEditing(diary, e)}
                      >
                        <Edit fontSize={16} /> 编辑
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDiary(diary.id);
                        }}
                      >
                        <Delete fontSize={16} /> 删除
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Diary;