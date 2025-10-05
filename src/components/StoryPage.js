import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './Loginpage';
import Cover from '../assets/Cover.png'; // Verify this path

const StoryPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [selectedComic, setSelectedComic] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Start at page 0

  const handleComicClick = (comicId) => {
    console.log('Comic selected:', comicId);
    setSelectedComic(comicId);
    setCurrentPage(0); // Reset to first page
  };

  const handleOptionClick = () => {
    console.log('Option clicked, advancing to next page');
    setCurrentPage((prev) => Math.min(prev + 1, 10)); // Limit to 10 pages (0-9 index)
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handlePlay = () => {
    console.log('Play button clicked - narration placeholder');
    // Does nothing for now
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontFamily: "'Bangers', cursive" }}>
      Loading your web-slingers...
    </div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!selectedComic) {
    return (
      <div style={{
        fontFamily: "'Bangers', cursive",
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        background: '#f0f0f0',
        color: '#333',
        minHeight: '100vh'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '40px', border: '2px dashed #ff006e', padding: '10px' }}>
          <h1 style={{ color: '#ff006e', fontSize: '2.8em', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Spider-Verse Interactive Story
          </h1>
          <p style={{ color: '#666', fontStyle: 'italic', fontSize: '1.2em' }}>
            Powered by 3 AI Agents: Script, Art, & Voice.
          </p>
          <p style={{ fontSize: '1.1em' }}>
            Welcome, 
            <span style={{ fontWeight: 'bold', color: '#ff006e' }}>
              {user?.name || user?.nickname || user?.email || 'Guest'}
            </span>
          </p>
          <button
            onClick={handleLogout}
            style={{
              background: '#ff006e',
              color: '#fff',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop: '15px',
              fontSize: '1.2em',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#8338ec';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#ff006e';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Logout Now
          </button>
        </header>

        <section style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
          {[1, 2, 3].map((comicId) => (
            <div key={comicId} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleComicClick(comicId)}>
              <img
                src={Cover}
                alt={`Comic ${comicId}`}
                style={{
                  maxWidth: '200px',
                  height: 'auto',
                  border: '3px solid #ff006e',
                  borderRadius: '10px',
                  boxShadow: '0 0 15px rgba(255, 0, 110, 0.5)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
              <p style={{ color: '#004e92', fontSize: '1.2em', marginTop: '10px' }}>Comic {comicId}</p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Bangers', cursive",
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      background: '#f0f0f0',
      color: '#333',
      minHeight: '100vh'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px', border: '2px dashed #ff006e', padding: '10px' }}>
        <h1 style={{ color: '#ff006e', fontSize: '2.8em', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Spider-Verse Interactive Story
        </h1>
        <p style={{ color: '#666', fontStyle: 'italic', fontSize: '1.2em' }}>
          Powered by 3 AI Agents: Script, Art, & Voice.
        </p>
        <p style={{ fontSize: '1.1em' }}>
          Welcome, 
          <span style={{ fontWeight: 'bold', color: '#ff006e' }}>
            {user?.name || user?.nickname || user?.email || 'Guest'}
          </span>
        </p>
        <button
          onClick={handleLogout}
          style={{
            background: '#ff006e',
            color: '#fff',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '15px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            transition: 'background 0.2s, transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#8338ec';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#ff006e';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Logout Now
        </button>
      </header>

      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#004e92', fontSize: '1.8em', marginBottom: '20px' }}>
          Comic Page {currentPage + 1}
        </h2>
        <div style={pageStyle}>
          <div style={panelStyle}>Panel Placeholder (from agentic API)</div>
          <p>Dialogue: "Hero says..." (from agentic API)</p>
          <button
            onClick={handlePlay}
            style={{
              background: '#ff006e',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              margin: '20px 0',
              fontSize: '1em',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#8338ec'}
            onMouseOut={(e) => e.target.style.background = '#ff006e'}
          >
            Play Narration
          </button>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleOptionClick}
              style={{
                background: '#8338ec',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                margin: '0 10px',
                fontSize: '1em',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#ff006e'}
              onMouseOut={(e) => e.target.style.background = '#8338ec'}
            >
              Option 1
            </button>
            <button
              onClick={handleOptionClick}
              style={{
                background: '#8338ec',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                margin: '0 10px',
                fontSize: '1em',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#ff006e'}
              onMouseOut={(e) => e.target.style.background = '#8338ec'}
            >
              Option 2
            </button>
          </div>
        </div>
      </section>

      <aside style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#ff006e',
        color: '#fff',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        fontSize: '1em'
      }}>
        <h4 style={{ margin: '0 0 10px' }}>System Alert</h4>
        <button 
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1em',
            textDecoration: 'underline'
          }}
          onClick={() => {
            setSelectedComic(null);
            setCurrentPage(0);
          }}
        >
          Choose Another Comic
        </button>
      </aside>
    </div>
  );
};

const pageStyle = {
  background: '#fff',
  padding: '20px',
  border: '1px solid #ddd',
  textAlign: 'center',
  fontFamily: "'Bangers', cursive",
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const panelStyle = {
  width: '80%',
  height: '200px',
  background: '#eee',
  margin: '10px 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px dashed #ccc',
  fontStyle: 'italic'
};

export default StoryPage;