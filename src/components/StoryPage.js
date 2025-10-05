import React, { useState, useEffect, useCallback } from 'react'; // 🚨 Added useCallback
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './Loginpage';
// import testData from './test.json'; // 🚨 REMOVED: Using live API data
import styles from './StoryPage.module.css';

const StoryPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  
  const [currentPage, setCurrentPage] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [storyData, setStoryData] = useState({
    page: 0,
    story: 'Loading the WEBVERSE...', // Initial loading message
    dialogues: [],
    choices: [],
    history: [],
    image: null // Start with null
  });
  const [isStoryLoading, setIsStoryLoading] = useState(true); // 🚨 NEW: Loading state for API
  
  const soundEffects = ['POW!', 'BAM!', 'WHAM!', 'THWIP!', 'BOOM!', 'ZAP!'];

  // 🚨 API Endpoint
  const STORY_API_ENDPOINT = "https://dev-a6a5q6irm.agentuity.run/0869fb10adad5aa7841eb834eccfda58";

  // Utility functions wrapped in useCallback for performance
  
  const createPowEffect = useCallback((x, y) => {
    const pow = document.createElement('div');
    pow.className = styles.powEffect;
    pow.textContent = soundEffects[Math.floor(Math.random() * soundEffects.length)];
    pow.style.left = `${x - 50}px`;
    pow.style.top = `${y - 50}px`;
    document.body.appendChild(pow);
    setTimeout(() => pow.remove(), 1000);
  }, [soundEffects]);

  const parseStoryData = useCallback((data) => ({
    page: data.writer.body.page,
    story: data.writer.body.story,
    dialogues: data.writer.body.dialogues,
    choices: data.writer.body.choices,
    history: data.writer.body.history,
    image: data.image.body.data ? `data:image/png;base64,${data.image.body.data}` : null
  }), []); 

  // ====================================================================
  // 1. Initial Fetch (Plain Text POST)
  // ====================================================================
  const fetchInitialStory = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsStoryLoading(true);

    const initialPromptText = "Start a brand-new Spider-Man adventure with a surprising inciting incident in New York City. Invent an original villain motivation or anomaly. End with a sharp cliffhanger that naturally leads into both choices.";
    
    try {
        const response = await fetch(STORY_API_ENDPOINT, {
            method: 'POST',
            headers: {
                // CRITICAL: Set Content-Type to 'text/plain' for the raw string body
                'Content-Type': 'text/plain', 
            },
            body: initialPromptText, 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const initialData = await response.json();
        console.log('Initial story loaded (Text Request):', initialData);
        
        setStoryData(parseStoryData(initialData));
        setCurrentPage(1);
        
    } catch (error) {
        console.error('Failed to fetch initial story:', error);
        setStoryData(prev => ({ 
            ...prev, 
            story: 'Failed to load initial story. Check console for error.', 
            image: null 
        }));
    } finally {
        setIsStoryLoading(false); 
    }
  }, [isAuthenticated, STORY_API_ENDPOINT, parseStoryData]);

  // ====================================================================
  // 2. Choice Click (JSON POST)
  // Replaces your static handleOptionClick
  // ====================================================================
  const handleOptionClick = useCallback(async (choiceId, label) => {
    
    // PAYLOAD 2: Send history and the chosen label as JSON
    const choiceData = {
      history: storyData.history, 
      choice: label              
    };
    
    console.log('Sending payload to API (JSON request):', choiceData);
    setIsStoryLoading(true);
    
    try {
        const response = await fetch(STORY_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(choiceData), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const newStoryData = await response.json();
        
        setStoryData(parseStoryData(newStoryData));
        setCurrentPage((prev) => prev + 1); 

    } catch (error) {
        console.error('Failed to fetch new story page (JSON request):', error);
    } finally {
        setIsStoryLoading(false);
    }
    
    if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2);
  }, [storyData.history, STORY_API_ENDPOINT, createPowEffect, parseStoryData]);

  const handleLogout = useCallback(() => {
    logout({ returnTo: window.location.origin });
    if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2);
  }, [logout, createPowEffect]);
  
  // NOTE: toggleDarkMode function was removed as it was not used in the UI, 
  // but handlePlay was kept and wrapped in useCallback.

  // ====================================================================
  // 3. Narration Fetch (ElevenLabs API)
  // ====================================================================
  const handlePlay = useCallback(async () => {
    if (isPlaying || !storyData.story) return;

    setIsPlaying(true);
    try {
      const narrationText = storyData.story;
      const voiceId = "21m00Tcm4TlvDq8ikWAM";
      const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;

      if (!apiKey) {
        console.error('ElevenLabs API key not found. Add REACT_APP_ELEVENLABS_API_KEY to .env');
        setIsPlaying(false);
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
    if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2);
  }, [isPlaying, storyData.story, createPowEffect]);

  // Initial load and global click effect listener
  useEffect(() => {
    // 🚨 This replaces the static testData useEffect.
    // It calls the API ONLY when the user is authenticated.
    if (isAuthenticated) {
      fetchInitialStory(); 
    }
    
    const handleDocumentClick = (e) => {
      if (Math.random() > 0.3) {
        createPowEffect(e.clientX, e.clientY);
      }
    };
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isAuthenticated, createPowEffect, fetchInitialStory]); // Dependencies for useEffect


  if (isLoading || isStoryLoading) {
    return <div className={styles.loading}>{storyData.story}</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className={styles.body}>
      <div className={styles.dotsOverlay}></div>

      <header className={styles.header}>
        <h1 className={styles.title}>WEBVERSE</h1>
        <p className={styles.subtitle}>🕸️ Powered by 3 AI Agents: Script, Art, & Voice 🕸️</p>
        <p className={styles.welcome}>
          Welcome, <span className={styles.userName}>{user?.name || user?.nickname || user?.email || 'Guest'}</span>
        </p>
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
        >
          Logout
        </button>
      </header>

      <section className={styles.pageSection}>
        <div className={styles.page}>
          <div className={styles.panelContainer}>
            <div className={styles.panel}>
              {storyData.image ? (
                <img
                  src={storyData.image}
                  alt={`Panel ${storyData.page}`}
                  className={styles.comicImage}
                  onError={(e) => console.log('Image load error:', e)}
                />
              ) : (
                <div className={styles.loading}>Generating image...</div>
              )}
            </div>
          </div>

          <div className={styles.storyTextContainer}>
            <p className={styles.storyText}>{storyData.story}</p>
            
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className={`${styles.narrateButton} ${isPlaying ? styles.playing : ''}`}
            >
              {isPlaying ? '⏸️ PLAYING...' : '▶️ NARRATE'}
            </button>

            <h3 className={styles.choicesPrompt}>What will you do?</h3>
          </div>

          <div className={styles.optionsContainer}>
            {storyData.choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => handleOptionClick(choice.id, choice.label)}
                className={styles.optionButton}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className={styles.choiceIcon}>⚡</span>
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button
        className={styles.restartButton}
        onClick={() => {
          setCurrentPage(1);
          fetchInitialStory(); // 🚨 Call API function to restart story
          if (Math.random() > 0.3) createPowEffect(window.innerWidth / 2, window.innerHeight / 2);
        }}
      >
        🔄 RESTART
      </button>
    </div>
  );
};

export default StoryPage;