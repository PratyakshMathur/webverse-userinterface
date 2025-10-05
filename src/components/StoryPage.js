import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './Loginpage';
import Cover from '../assets/Cover.png'; // Verify this path
import styles from './StoryPage.module.css';

const StoryPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [selectedComic, setSelectedComic] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Start at page 0
  const [isPlaying, setIsPlaying] = useState(false); // Track narration state
  const soundEffects = ['POW!', 'BAM!', 'WHAM!', 'THWIP!', 'BOOM!', 'ZAP!'];

  const handleComicClick = (comicId) => {
    console.log('Comic selected:', comicId);
    setSelectedComic(comicId);
    setCurrentPage(0); // Reset to first page
    if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2); // 70% chance
  };

  const handleOptionClick = () => {
    console.log('Option clicked, advancing to next page');
    setCurrentPage((prev) => Math.min(prev + 1, 10)); // Limit to 10 pages (0-9 index)
    if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2); // 70% chance
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2); // 70% chance
  };

  const handlePlay = async () => {
    if (isPlaying) return; // Prevent multiple plays

    setIsPlaying(true);
    try {
      const narrationText = "Dialogue: \"Hero says...\" (from agentic API)"; // Placeholder; replace with API data
      const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Replace with your preferred voice ID
      const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;

      if (!apiKey) {
        console.error('ElevenLabs API key not found. Add REACT_APP_ELEVENLABS_API_KEY to .env');
        return;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: narrationText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.6,
          },
          output_format: 'mp3_44100_128',
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const audioData = await response.arrayBuffer();
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => console.error('Audio playback error:', error));

      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
        setIsPlaying(false);
      });
    } catch (error) {
      console.error('ElevenLabs narration error:', error);
      setIsPlaying(false);
    }
    if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2); // 70% chance
  };

  const createPowEffect = (x, y) => {
    const pow = document.createElement('div');
    pow.className = styles.powEffect;
    pow.textContent = soundEffects[Math.floor(Math.random() * soundEffects.length)];
    pow.style.left = `${x - 50}px`;
    pow.style.top = `${y - 50}px`;
    document.body.appendChild(pow);
    setTimeout(() => pow.remove(), 1000);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (Math.random() > 0.3) {
        createPowEffect(e.clientX, e.clientY);
      }
    };
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading your web-slingers...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!selectedComic) {
    return (
      <div className={styles.body}>
        <div className={styles.dotsOverlay}></div>
        <header className={styles.header}>
          <h1 className={styles.title}>Spider-Verse Interactive Story</h1>
          <p className={styles.subtitle}>🕸️ Powered by 3 AI Agents: Script, Art, & Voice. 🕸️</p>
          <p className={styles.welcome}>
            Welcome, <span className={styles.userName}>{user?.name || user?.nickname || user?.email || 'Guest'}</span>
          </p>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            onMouseOver={(e) => (e.target.style.transform = 'translate(-2px, -2px)')}
            onMouseOut={(e) => (e.target.style.transform = 'translate(0, 0)')}
          >
            Logout Now
          </button>
        </header>

        <section className={styles.comicSelection}>
          {[1, 2, 3].map((comicId) => (
            <div
              key={comicId}
              className={styles.comicCard}
              onClick={() => handleComicClick(comicId)}
              onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
            >
              <img
                src={Cover}
                alt={`Comic ${comicId}`}
                className={styles.comicImage}
              />
              <p className={styles.comicTitle}>Comic {comicId}</p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <div className={styles.dotsOverlay}></div>
      <header className={styles.header}>
        <h1 className={styles.title}>Spider-Verse Interactive Story</h1>
        <p className={styles.subtitle}>🕸️ Powered by 3 AI Agents: Script, Art, & Voice. 🕸️</p>
        <p className={styles.welcome}>
          Welcome, <span className={styles.userName}>{user?.name || user?.nickname || user?.email || 'Guest'}</span>
        </p>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
          onMouseOver={(e) => (e.target.style.transform = 'translate(-2px, -2px)')}
          onMouseOut={(e) => (e.target.style.transform = 'translate(0, 0)')}
        >
          Logout Now
        </button>
      </header>

      <section className={styles.pageSection}>
        <h2 className={styles.pageTitle}>Comic Page {currentPage + 1}</h2>
        <div className={styles.page}>
          <div className={styles.panel}>Panel Placeholder (from agentic API)</div>
          <p className={styles.dialogue}>Dialogue: "Hero says..." (from agentic API)</p>
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`${styles.playButton} ${isPlaying ? styles.disabled : ''}`}
            onMouseOver={(e) => {
              if (!isPlaying) e.target.style.background = '#8338ec';
            }}
            onMouseOut={(e) => {
              if (!isPlaying) e.target.style.background = '#ff006e';
            }}
          >
            {isPlaying ? 'Playing...' : 'Play Narration'}
          </button>
          <div className={styles.optionsContainer}>
            <button
              onClick={handleOptionClick}
              className={styles.optionButton}
              onMouseOver={(e) => (e.target.style.background = '#ff006e')}
              onMouseOut={(e) => (e.target.style.background = '#8338ec')}
            >
              Option 1
            </button>
            <button
              onClick={handleOptionClick}
              className={styles.optionButton}
              onMouseOver={(e) => (e.target.style.background = '#ff006e')}
              onMouseOut={(e) => (e.target.style.background = '#8338ec')}
            >
              Option 2
            </button>
          </div>
        </div>
      </section>

      <aside className={styles.aside}>
        <h4 className={styles.asideTitle}>System Alert</h4>
        <button
          className={styles.restartButton}
          onClick={() => {
            setSelectedComic(null);
            setCurrentPage(0);
            if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2); // 70% chance
          }}
        >
          Choose Another Comic
        </button>
      </aside>
    </div>
  );
};

export default StoryPage;