import React from 'react';
import styles from './AppHeader.module.css';

const AppHeader = ({ title }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
};

export default AppHeader;