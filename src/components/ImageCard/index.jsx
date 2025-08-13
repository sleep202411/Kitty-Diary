import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ImageCard.module.css';

const ImageCard = ({ image, onLike }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef(null);
  const observerRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

    const debouncedObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadingTimeoutRef.current = setTimeout(() => {
            const img = new Image();
            img.src = image.url;
            img.onload = handleLoad;
          }, 300);
          observerRef.current.unobserve(entry.target);
        }
      },
      { 
        rootMargin: '200px 0px 200px 0px',
        threshold: 0.01 
      }
    );

    observerRef.current = debouncedObserver;
    observerRef.current.observe(cardRef.current);

    return () => {
      observerRef.current?.disconnect();
      clearTimeout(loadingTimeoutRef.current);
    };
  }, [image.url, handleLoad]);

  return (
    <div 
      ref={cardRef}
      className={styles.card}
      aria-labelledby={`caption-${image.id}`}
      role="article"
    >
      <div className={styles.imageContainer}>
        {isLoaded ? (
          <img
            src={image.url}
            alt={image.caption}
            className={`${styles.image} ${styles.loaded}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>

      <div className={styles.content}>
        <p id={`caption-${image.id}`} className={styles.caption}>
          {image.caption}
        </p>
        
        <div className={styles.meta}>
          <div className={styles.date}>
            {image.date}
            <div className={styles.tags}>
              {image.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          </div>
          <span className={styles.mood}>{image.mood}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;