
'use client';

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: 'white',
      flexDirection: 'column'
    }}>
      <div style={{
        border: '8px solid #1e1e1e',
        borderTop: '8px solid #0070f3',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>Hold yo ass...</p>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
