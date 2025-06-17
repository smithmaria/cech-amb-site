const Loading = () => {
  const loadingPageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%'
  };

  const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #a12537',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={loadingPageStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </div>
  );
}

export default Loading;