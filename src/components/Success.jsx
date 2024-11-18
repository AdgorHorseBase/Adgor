import React from 'react';

const Success = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Thank You for Your Purchase!</h1>
      <p style={styles.message}>Your order has been successfully completed.</p>
      <p style={styles.orderInfo}>A confirmation email has been sent to your inbox.</p>
      <button style={styles.button} onClick={() => window.location.href = '/'}>Back to Home</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '90vh',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
  orderInfo: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '30px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default Success;