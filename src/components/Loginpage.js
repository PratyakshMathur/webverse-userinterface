import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
      fontFamily: "'Bangers', cursive",
      color: '#fff',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path d=\"M0 50 Q25 0 50 50 T100 50\" stroke=\"%23ff006e\" stroke-width=\"0.5\" fill=\"none\" opacity=\"0.2\"/></svg>")',
      backgroundSize: '200px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '450px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '20px',
        padding: '40px',
        border: '3px solid #ff006e',
        boxShadow: '0 0 25px rgba(255, 0, 110, 0.6)',
      }}>
        <h1 style={{ fontSize: '3em', marginBottom: '15px', textShadow: '3px 3px 5px #ff006e' }}>
          WebVerse Login
        </h1>
        <p style={{ fontSize: '1.3em', marginBottom: '30px', opacity: 0.9 }}>
          Swing into your interactive comic adventure!
        </p>
        <button
          onClick={() => loginWithRedirect({ redirectUri: window.location.origin })}
          style={{
            background: 'linear-gradient(45deg, #ff006e, #8338ec)',
            color: '#fff',
            border: 'none',
            padding: '15px 40px',
            fontSize: '1.2em',
            borderRadius: '30px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 5px 15px rgba(255, 0, 110, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Login to Start Your Saga
        </button>
      </div>
    </div>
  );
};

export default LoginPage;