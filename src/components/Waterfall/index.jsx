import { useEffect, useState } from 'react';
import styles from './waterfall.module.css';
import ImageCard from '../ImageCard';
import KittyLoading from '../KittyLoading';
import { useImageStore } from '@/store/useImageStore';

const Waterfall = () => {
  const { images, loading, hasMore, fetchMore } = useImageStore();
  const [leftCol, setLeftCol] = useState([]);
  const [rightCol, setRightCol] = useState([]);

  // 分配新图片到左右列
  useEffect(() => {
    const newLeft = [...leftCol];
    const newRight = [...rightCol];

    const getHeight = col => col.reduce((sum, img) => sum + img.height, 0);

    images.slice(leftCol.length + rightCol.length).forEach(img => {
      if (getHeight(newLeft) <= getHeight(newRight)) newLeft.push(img);
      else newRight.push(img);
    });

    setLeftCol(newLeft);
    setRightCol(newRight);
  }, [images]);

  // 下拉加载
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && !loading && hasMore) {
        window.requestAnimationFrame(() => {
          if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            fetchMore();
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchMore]);

  // 初始化加载
  useEffect(() => {
    if (images.length === 0) fetchMore();
  }, [fetchMore, images.length]);

  return (
    <div className={styles.container}>
      <div className={styles.waterfallWrapper}>
        <div className={styles.column}>
          {leftCol.map(img => <ImageCard key={img.id} image={img} />)}
        </div>
        <div className={styles.column}>
          {rightCol.map(img => <ImageCard key={img.id} image={img} />)}
        </div>
      </div>
      {loading && <KittyLoading />}
      {!hasMore && images.length > 0 && (
        <div className={styles.noMore}>没有更多内容啦～</div>
      )}
    </div>
  );
};

export default Waterfall;
