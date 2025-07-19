// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const styles = {
    container: {
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F4F5FF',
      textAlign: 'center',
      padding: '20px',
    },
    heading: {
      fontSize: '72px',
      color: '#b0306a',
      marginBottom: '20px',
    },
    subheading: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    paragraph: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '30px',
    },
    link: {

      padding: "13px 10px",
      border: "0px solid",
      backgroundColor: "#b0306a",
      color: "white",
      fontWeight: 700,
      borderRadius: 10,
      fontSize: 16,
      marginTop: 7,
    textDecoration: 'none',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <h2 style={styles.subheading}>Page Not Found</h2>
      <p style={styles.paragraph}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" style={styles.link}>Go to Home</Link>
    </div>
  );
};

export default NotFound;
