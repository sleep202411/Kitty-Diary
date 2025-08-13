import styles from './loading.module.css';
import { memo } from 'react';
import { Flex, Loading as RVLoading } from 'react-vant';

const KittyLoading = () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>喵～Kitty 正在为你加载页面…</p>
      <Flex justify="center" style={{ marginTop: '10px' }}>
        <RVLoading type="spinner" />
      </Flex>
    </div>
  );
};

export default memo(KittyLoading);
