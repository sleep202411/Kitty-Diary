// src/pages/Home.js
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useTitle from '@/hooks/useTitle';
import { useImageStore } from '@/store/useImageStore';
import SearchBox from '@/components/SearchBox';
import Waterfall from '@/components/Waterfall';
import styles from './Home.module.css';
import AppHeader from '@/components/AppHeader';

const Home = () => {
  useTitle('Kitty小屋');
  const {
    images,
    loading,
    fetchMore,
    hasMore,
    error
  } = useImageStore();
  
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const throttleTimeoutRef = useRef(null);

  const throttle = useCallback((fn, delay) => {
    return (...args) => {
      if (throttleTimeoutRef.current) return;
      
      throttleTimeoutRef.current = setTimeout(() => {
        fn(...args);
        throttleTimeoutRef.current = null;
      }, delay);
    };
  }, []);

  const handleScroll = useCallback(
    throttle(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        fetchMore();
      }
    }, 300),
    [loading, hasMore, fetchMore, throttle]
  );

  useEffect(() => {
    if (images.length === 0 && !error) {
      fetchMore();
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchMore, images.length, error, handleScroll]);

  const currentImages = useMemo(() => {
    if (!query.trim()) return images;
    
    const keyword = query.trim().toLowerCase();
    return images.filter(
      (img) =>
        img.caption?.toLowerCase().includes(keyword) ||
        img.tags?.some((tag) => tag.toLowerCase().includes(keyword))
    );
  }, [images, query]);

  const handleSearchClick = useCallback(() => {
    navigate('/search', {
      state: {
        initialQuery: query,
        shouldFocus: true,
      },
    });
  }, [navigate, query]);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const handleWriteDiary = useCallback(() => {
    navigate('/diary');
  }, [navigate]);

  return (
    <div className={styles.container}>
      <AppHeader title="日记箱" />

      <div onClick={handleSearchClick} className={styles.searchBoxWrapper}>
        <SearchBox
          value={query}
          onChange={handleQueryChange}
          isSearchPage={false}
          shouldAutoFocus={false}
        />
      </div>

      {error ? (
        <div className={styles.errorMessage}>
          加载失败，请稍后重试
          <button onClick={fetchMore} className={styles.retryButton}>
            重试
          </button>
        </div>
      ) : (
        <Waterfall
          images={currentImages}
          loading={loading}
          hasMore={hasMore}
          fetchMore={fetchMore}
        />
      )}

      <button
        className={styles.diaryButton}
        onClick={handleWriteDiary}
        aria-label="写日记"
      >
        <span className={styles.buttonIcon}>✏️</span>
      </button>
    </div>
  );
};

export default Home;