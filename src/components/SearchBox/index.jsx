import {
    memo,
    useRef,
    useEffect,
    useState,
    useMemo,
    useCallback
} from 'react';
import styles from './searchBox.module.css';
import {
    ArrowLeft,
    Close
} from '@react-vant/icons'
import { debounce } from '@/utils/index';

const SearchBox = (props) => {
    const [query, setQuery] = useState("");
    const { handleQuery, isSearchPage = false, shouldAutoFocus = true } = props;
    const queryRef = useRef(null);

    // 使用 useCallback 确保防抖函数稳定
    const handleQueryDebounce = useMemo(() => {
        if (typeof handleQuery !== 'function') {
            return () => {};
        }
        return debounce(handleQuery, 500);
    }, [handleQuery]); // 添加 handleQuery 依赖

    useEffect(() => {
        if (shouldAutoFocus) {
            queryRef.current?.focus();
        }
    }, []);

    useEffect(() => {
        handleQueryDebounce(query);
        // 返回清除函数，避免内存泄漏
        return () => handleQueryDebounce.cancel?.();
    }, [query, handleQueryDebounce]);

    const handleChange = useCallback((e) => {
        const val = e.currentTarget.value;
        setQuery(val);
    }, []);

    const clearQuery = useCallback(() => {
        setQuery('');
        if (queryRef.current) {
            queryRef.current.value = '';
            queryRef.current.focus();
        }
    }, []);

    const displayStyle = query ? { display: 'block' } : { display: 'none' };

    return (
        <div className={styles.wrapper}>
            {isSearchPage && <ArrowLeft onClick={() => window.history.go(-1)} />}
            <input 
                ref={queryRef} 
                className={styles.box} 
                placeholder="搜索日记" 
                onChange={handleChange}
                value={query} // 添加受控组件的value属性
            />
            <Close 
                onClick={clearQuery} 
                className={styles.clear} 
                style={displayStyle}
            />
        </div>
    );
}

export default memo(SearchBox);