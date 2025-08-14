// Waterfall.js
import { useState, useEffect} from 'react';
import styles from './waterfall.module.css';
import ImageCard from '../ImageCard';
import KittyLoading from '../KittyLoading';
import { useImageStore }from '@/store/useImageStore';

const Waterfall = () => {
  const { images, loading, hasMore, fetchMore } = useImageStore();
  const [columns, setColumns] = useState(2);

  // Responsive layout
  useEffect(() => {
    const handleResize = () => {
      setColumns(2);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Infinite scroll with debounce
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking && !loading && hasMore) {
        window.requestAnimationFrame(() => {
          if (window.innerHeight + window.scrollY >= 
              document.body.offsetHeight - 500) {
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

  // Initialize on mount
  useEffect(() => {
    if (images.length === 0) {
      fetchMore();
    }
  }, [fetchMore, images.length]);

  return (
    <div className={styles.container}>
      <div className={styles.waterfall}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className={styles.column}>
            {images
              .filter((_, index) => index % columns === colIndex)
              .map(image => (
                <ImageCard 
                  key={image.id} 
                  image={image} 
                />
              ))}
          </div>
        ))}
      </div>

      {loading && <KittyLoading />}
      {!hasMore && images.length > 0 && (
        <div className={styles.noMore}>没有更多内容啦～</div>
      )}
    </div>
  );
};

export default Waterfall;