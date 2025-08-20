import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ImageCard.module.css';

const ImageCard = ({ image }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef(null);
  const observerRef = useRef(null);

  const handleLoad = useCallback(() => setIsLoaded(true), []);

  useEffect(() => {
    if (!cardRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = image.url;
          img.onload = handleLoad;
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    observer.observe(cardRef.current);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [image.url, handleLoad]);

  return (
    <div ref={cardRef} className={styles.card}>
      <div
        className={styles.imageContainer}
        style={{ minHeight: `${image.height / 75}rem` }} // rem单位
      >
        {isLoaded ? (
          <img
            src={image.url}
            alt={image.caption}
            className={`${styles.image} ${styles.loaded}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.placeholder}></div>
        )}
      </div>
      <div className={styles.content}>
        <p className={styles.caption}>{image.caption}</p>
        <div className={styles.meta}>
          <div className={styles.date}>
            {image.date}
            <div className={styles.tags}>
              {image.tags.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
            </div>
          </div>
          <span className={styles.mood}>{image.mood}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
