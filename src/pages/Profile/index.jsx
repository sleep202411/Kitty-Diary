import { useState, useEffect, useRef } from 'react';
import useTitle from "@/hooks/useTitle";
import styles from "./profile.module.css";
import { generateAvatar } from '@/llm';
import { ActionSheet, Image, Loading, Toast, Dialog, Button, Input } from 'react-vant';
import useUserStore from '@/store/useUserStore';

const Profile = () => {
  useTitle("我的小天地");

  const userStore = useUserStore();
  const { userInfo, setUserInfo } = userStore;

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const retryCount = useRef(0);
  const inputRef = useRef(null);


  const actions = [
    { name: 'AI生成头像', color: '#ee0a24', type: 1 },
    { name: '上传头像', color: '#123123', type: 2 },
  ];

  const handleAction = async (e) => {
    setShowActionSheet(false);

    if (e.type === 1) {
      try {
        setLoading(true);
        const text = `昵称: ${userInfo.nickname}\n个性签名: ${userInfo.status}`;
        const newAvatar = await generateAvatar(text);

        if (newAvatar && (newAvatar.startsWith('http') || newAvatar.startsWith('data:'))) {
          userStore.setUserInfo({ avatar: newAvatar });
          Toast.success('头像生成成功！');
        } else {
          Toast.fail('头像生成失败，请重试');
        }
      } catch (error) {
        console.error('生成头像失败:', error);
        Toast.fail('头像生成失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    } else if (e.type === 2) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            userStore.setUserInfo({ avatar: event.target.result });
            Toast.success('头像上传成功！');
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const startEditing = (field) => {
    setEditingField(field);
    setEditValue(userInfo[field]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      userStore.setUserInfo({ [editingField]: editValue });
      Toast.success('修改成功！');
    }
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  return (
    <div className={styles.container}>
      {/* 用户信息 */}
      <section className={styles.userInfo}>
        <div className={styles.avatarContainer}>
          <Image
            round
            src={userInfo.avatar}
            alt="头像"
            className={styles.avatar}
            onClick={() => setShowActionSheet(true)}
          />
          {loading && <Loading className={styles.avatarLoading} />}
        </div>

        <div className={styles.userText}>
          {editingField === 'nickname' ? (
            <div className={styles.editContainer}>
              <Input
                ref={inputRef}
                value={editValue}
                onChange={setEditValue}
                className={styles.editInput}
              />
              <div className={styles.editButtons}>
                <Button size="small" onClick={saveEdit}>保存</Button>
                <Button size="small" plain onClick={cancelEdit}>取消</Button>
              </div>
            </div>
          ) : (
            <h2 
              className={styles.nickname}
              onClick={() => startEditing('nickname')}
            >
              {userInfo.nickname}
            </h2>
          )}

          {editingField === 'status' ? (
            <div className={styles.editContainer}>
              <Input
                ref={inputRef}
                value={editValue}
                onChange={setEditValue}
                className={styles.editInput}
              />
              <div className={styles.editButtons}>
                <Button size="small" onClick={saveEdit}>保存</Button>
                <Button size="small" plain onClick={cancelEdit}>取消</Button>
              </div>
            </div>
          ) : (
            <p 
              className={styles.status}
              onClick={() => startEditing('status')}
            >
              {userInfo.status}
            </p>
          )}
        </div>
      </section>

      <section className={styles.tips}>
        <h3>🐾 Kitty 小贴士</h3>
        <div className={styles.tipCard}>
          多喝热水，保持好心情
        </div>
      </section>

      <section className={styles.badges}>
        <h3>🏅 我的勋章</h3>
        <div className={styles.badgeList}>
          <div className={styles.badge}>📅 连续打卡 7 天</div>
          <div className={styles.badge}>💬 聊天 100 次</div>
        </div>
      </section>

      <section className={styles.settings}>
        <h3>⚙️ 应用设置</h3>
        <ul className={styles.settingsList}>
          <li className={styles.settingItem}>账号设置</li>
          <li className={styles.settingItem}>安全与隐私</li>
          <li className={styles.settingItem}>通知与提醒</li>
        </ul>
      </section>

      <ActionSheet
        visible={showActionSheet}
        actions={actions}
        cancelText="取消"
        onCancel={() => setShowActionSheet(false)}
        onSelect={handleAction}
      />
    </div>
  );
};

export default Profile;