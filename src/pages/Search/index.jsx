import styles from './search.module.css';
import {
  useState,
  useEffect
} from 'react'
import SearchBox from '@/components/SearchBox';
import useSearchStore from '@/store/useSearchStore'
import useTitle from '@/hooks/useTitle';

const Search = () => {
    useTitle('搜索');

  const searchBack = () => {}
  const [query, setQuery] = useState('');
  const { 
    suggestList,
    setSuggestList,
    hotList,
    setHotList,
    searchHistory,
    addHistory,
    clearHistory
  } = useSearchStore();

  useEffect(() => {
    setHotList();
  }, [])

  const handleQuery = (q) => {
    setQuery(q);
    if(!q) return;
    addHistory(q);
    setSuggestList(q);
  }
  
  const suggestListStyle = {
    display: query === '' ? 'none' : 'block'
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SearchBox  handleQuery={handleQuery} isSearchPage={true}></SearchBox>
        {/* // 组件结构优化 */}
      <div className={styles.suggestContainer}>
         <div className={styles.list} style={suggestListStyle}>
         {suggestList.map((item, index) => (
      <div 
        key={item}
        className={styles.item}
      >
        {item}
      </div>
    ))}
  </div>
      </div>
        <div className={styles.suggestWrapper}>
          <h1 className={styles.title}>热门推荐</h1>
          <div className={styles.hot}>

            {hotList && hotList.map((item, index) =>(
              <div key={item.id} className={styles.item}>
              {item.keyword}
            </div>
            ))}
          </div>
          <div className={styles.history}>
    <h2>搜索历史</h2>

    {searchHistory.length > 0 ? (
      <>
        <ul className={styles.historyList}>
          {searchHistory && searchHistory.map((keyword, index) => (
            <li key={index} className={styles.historyItem}>
              {keyword}
            </li>
          ))}
        </ul>

        <button
          className={styles.clearBtn}
          onClick={clearHistory}
        >
          清空历史
        </button>
      </>
    ) : (
      <p className={styles.empty}>暂无搜索历史</p>
    )}
  </div>
         
        </div>
      </div>
    </div>
  )  
}

export default Search