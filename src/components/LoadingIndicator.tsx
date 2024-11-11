// src/components/LoadingIndicator.tsx

import React from 'react';
import { useAppSelector } from '../store/hooks';

const LoadingIndicator: React.FC = () => {
  const isLoading = useAppSelector((state) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div style={styles.spinnerContainer}>
      <div style={styles.spinner}></div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  spinnerContainer: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 1000,
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 2s linear infinite',
  },
};


export default LoadingIndicator;
