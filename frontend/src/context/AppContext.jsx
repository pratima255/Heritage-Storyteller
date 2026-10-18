import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TOPICS, BADGES_LIST, ARTIFACT_MATCH_ITEMS, MEMORY_GAME_ITEMS } from '../data/heritageData';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation screen state
  const [currentScreen, setCurrentScreen] = useState('home');

  // Topic Management State (Persistent in localStorage)
  const [topics, setTopics] = useState(() => {
    const TOPICS_VERSION = 'v33_bihu_folk_music_cinematic_fixed';
    const savedVersion = localStorage.getItem('heritage_topics_version');
    if (savedVersion !== TOPICS_VERSION) {
      localStorage.setItem('heritage_topics_version', TOPICS_VERSION);
      localStorage.setItem('heritage_topics', JSON.stringify(INITIAL_TOPICS));
      return INITIAL_TOPICS;
    }
    const saved = localStorage.getItem('heritage_topics');
    if (!saved) return INITIAL_TOPICS;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.length !== INITIAL_TOPICS.length) {
        localStorage.setItem('heritage_topics', JSON.stringify(INITIAL_TOPICS));
        return INITIAL_TOPICS;
      }
      const initialSanchi = INITIAL_TOPICS.find(t => t.id === 'mp-sanchi-stupa');
      const initialKhajuraho = INITIAL_TOPICS.find(t => t.id === 'mp-khajuraho-festival');
      const initialPashmina = INITIAL_TOPICS.find(t => t.id === 'pashmina-weaving');
      const initialWarli = INITIAL_TOPICS.find(t => t.id === 'warli-art');
      const initialBihu = INITIAL_TOPICS.find(t => t.id === 'bihu-folk-music');
      const updatedTopics = parsed.map(t => {
        if (t.id === 'mp-sanchi-stupa' && initialSanchi) {
          return {
            ...t,
            cover_image: initialSanchi.cover_image || '/sanchi-stupa.jpg',
            coverImage: initialSanchi.coverImage || '/sanchi-stupa.jpg',
            bannerImage: initialSanchi.bannerImage || '/sanchi-stupa.jpg',
            chapters: t.chapters ? t.chapters.map(c => ({
              ...c,
              imageUrl: initialSanchi.cover_image || '/sanchi-stupa.jpg',
              image_url: initialSanchi.cover_image || '/sanchi-stupa.jpg'
            })) : initialSanchi.chapters
          };
        }
        if (t.id === 'mp-khajuraho-festival' && initialKhajuraho) {
          return {
            ...t,
            cover_image: initialKhajuraho.cover_image || '/khajuraho-temple.jpg',
            coverImage: initialKhajuraho.coverImage || '/khajuraho-temple.jpg',
            bannerImage: initialKhajuraho.bannerImage || '/khajuraho-temple.jpg',
            chapters: t.chapters ? t.chapters.map(c => ({
              ...c,
              imageUrl: initialKhajuraho.cover_image || '/khajuraho-temple.jpg',
              image_url: initialKhajuraho.cover_image || '/khajuraho-temple.jpg'
            })) : initialKhajuraho.chapters
          };
        }
        if (t.id === 'pashmina-weaving' && initialPashmina) {
          return {
            ...t,
            cover_image: initialPashmina.cover_image || '/pashmina-weaving.jpg',
            coverImage: initialPashmina.coverImage || '/pashmina-weaving.jpg',
            bannerImage: initialPashmina.bannerImage || '/pashmina-weaving.jpg',
            chapters: t.chapters ? t.chapters.map(c => ({
              ...c,
              imageUrl: initialPashmina.cover_image || '/pashmina-weaving.jpg',
              image_url: initialPashmina.cover_image || '/pashmina-weaving.jpg'
            })) : initialPashmina.chapters
          };
        }
        if (t.id === 'warli-art' && initialWarli) {
          return {
            ...t,
            cover_image: initialWarli.cover_image || '/warli-art.jpg',
            coverImage: initialWarli.coverImage || '/warli-art.jpg',
            bannerImage: initialWarli.bannerImage || '/warli-art.jpg',
            chapters: t.chapters ? t.chapters.map(c => ({
              ...c,
              imageUrl: initialWarli.cover_image || '/warli-art.jpg',
              image_url: initialWarli.cover_image || '/warli-art.jpg'
            })) : initialWarli.chapters
          };
        }
        if (t.id === 'bihu-folk-music' && initialBihu) {
          return {
            ...t,
            cover_image: initialBihu.cover_image || '/bihu-music.jpg',
            coverImage: initialBihu.coverImage || '/bihu-music.jpg',
            bannerImage: initialBihu.bannerImage || '/bihu-music.jpg',
            chapters: t.chapters ? t.chapters.map(c => ({
              ...c,
              imageUrl: initialBihu.cover_image || '/bihu-music.jpg',
              image_url: initialBihu.cover_image || '/bihu-music.jpg'
            })) : initialBihu.chapters
          };
        }
        return t;
      });
      localStorage.setItem('heritage_topics', JSON.stringify(updatedTopics));
      return updatedTopics;
    } catch (e) {
      return INITIAL_TOPICS;
    }
  });

  const [artifactItems, setArtifactItems] = useState(() => {
    const saved = localStorage.getItem('heritage_artifact_items');
    return saved ? JSON.parse(saved) : ARTIFACT_MATCH_ITEMS;
  });

  const [memoryItems, setMemoryItems] = useState(() => {
    const saved = localStorage.getItem('heritage_memory_items');
    return saved ? JSON.parse(saved) : MEMORY_GAME_ITEMS;
  });

  // User State
  const [user, setUser] = useState({
    id: null,
    name: '',
    joined: 'Oct 2026',
    member_since: 'Oct 2026',
    xp: 0,
    level: 1,
    avatar: '👩‍🎓',
    role: 'Student',
    isLoggedIn: false
  });

  // User-Specific Progress States
  const [favorites, setFavorites] = useState([]);
  const [completedStories, setCompletedStories] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [gameStats, setGameStats] = useState({
    artifactMatchCompleted: 0,
    memoryGameCompleted: 0,
    totalGamesPlayed: 0
  });
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [lastActiveTopicId, setLastActiveTopicId] = useState(null);

  // Active Session State
  const [selectedTopicId, setSelectedTopicId] = useState('warli-art');
  const [currentChapterNumber, setCurrentChapterNumber] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [lastQuizScore, setLastQuizScore] = useState(null);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Centralized Text-to-Speech (TTS) Engine State
  const [speechState, setSpeechState] = useState({
    isPlaying: false,
    isPaused: false,
    rate: 1,
    currentTopicId: null,
    currentChapterNum: null,
    currentText: ''
  });

  // Notification Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Function to load user-specific progress from API
  const refreshUserProgress = async (userObj = null) => {
    const currentToken = localStorage.getItem('heritage_auth_token') || localStorage.getItem('heritage_jwt_token') || localStorage.getItem('heritage_token');
    
    // Unify on single token key
    if (currentToken) {
      localStorage.setItem('heritage_auth_token', currentToken);
    }
    localStorage.removeItem('heritage_jwt_token');
    localStorage.removeItem('heritage_token');

    if (!currentToken) {
      setUser({
        id: null,
        name: '',
        joined: 'Oct 2026',
        member_since: 'Oct 2026',
        xp: 0,
        level: 1,
        avatar: '👩‍🎓',
        role: 'Student',
        isLoggedIn: false
      });
      setCompletedStories([]);
      setQuizResults({});
      setGameStats({ artifactMatchCompleted: 0, memoryGameCompleted: 0, totalGamesPlayed: 0 });
      setUnlockedBadges([]);
      setActivities([]);
      setLastActiveTopicId(null);
      return;
    }

    try {
      // 1. Get user profile if not passed
      let userInfo = userObj;
      if (!userInfo) {
        const meRes = await api.getCurrentUser();
        if (meRes && meRes.success && meRes.data?.user) {
          userInfo = meRes.data.user;
        } else {
          // Token is expired, invalid, or user was deleted
          localStorage.removeItem('heritage_auth_token');
          setUser({
            id: null,
            name: '',
            joined: 'Oct 2026',
            member_since: 'Oct 2026',
            xp: 0,
            level: 1,
            avatar: '👩‍🎓',
            role: 'Student',
            isLoggedIn: false
          });
          setCompletedStories([]);
          setQuizResults({});
          setGameStats({ artifactMatchCompleted: 0, memoryGameCompleted: 0, totalGamesPlayed: 0 });
          setUnlockedBadges([]);
          setActivities([]);
          setLastActiveTopicId(null);
          return;
        }
      }

      if (!userInfo) return;

      const rawRole = (userInfo.role || 'Student').toString().toLowerCase();
      const roleDisplay = rawRole === 'admin' ? 'Admin' : 'Student';

      let joinedDisplay = userInfo.member_since || userInfo.joined;
      if (!joinedDisplay && userInfo.created_at) {
        try {
          joinedDisplay = new Date(userInfo.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        } catch (e) {
          joinedDisplay = 'Oct 2026';
        }
      }
      if (!joinedDisplay) joinedDisplay = 'Oct 2026';

      // 2. Get dashboard stats from backend for this user
      const dashRes = await api.getDashboardStats();
      if (dashRes && dashRes.success && dashRes.data) {
        const d = dashRes.data;

        setUser({
          id: d.id || d.user_id || userInfo.id,
          name: d.name || userInfo.name,
          joined: d.joined || d.member_since || joinedDisplay,
          member_since: d.member_since || d.joined || joinedDisplay,
          created_at: userInfo.created_at,
          xp: d.xp ?? userInfo.xp ?? 0,
          level: d.level ?? Math.floor((d.xp ?? userInfo.xp ?? 0) / 100) + 1,
          avatar: userInfo.avatar || '👩‍🎓',
          role: roleDisplay,
          isLoggedIn: true
        });

        setCompletedStories(d.completed_stories || []);
        setQuizResults(d.quiz_results || {});
        setGameStats(d.game_stats || { artifactMatchCompleted: 0, memoryGameCompleted: 0, totalGamesPlayed: 0 });
        setUnlockedBadges(d.unlocked_badges || []);

        const formattedActivities = (d.activities || []).map(a => ({
          id: a.id,
          title: a.title,
          xp: a.xp,
          time: a.created_at ? new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
        }));
        setActivities(formattedActivities);
        setLastActiveTopicId(d.last_active_topic_id || null);
        return;
      }

      // If dashboard stats fetch had an issue, populate with userInfo directly
      setUser({
        id: userInfo.id || userInfo.user_id,
        name: userInfo.name,
        joined: joinedDisplay,
        member_since: joinedDisplay,
        created_at: userInfo.created_at,
        xp: userInfo.xp ?? 0,
        level: Math.floor((userInfo.xp ?? 0) / 100) + 1,
        avatar: userInfo.avatar || '👩‍🎓',
        role: roleDisplay,
        isLoggedIn: true
      });
    } catch (err) {
      console.warn('Backend progress fetch failed', err);
    }
  };

  // On initial mount, check for auth token & load logged-in user
  useEffect(() => {
    const token = localStorage.getItem('heritage_auth_token') || localStorage.getItem('heritage_jwt_token') || localStorage.getItem('heritage_token');
    if (token) {
      refreshUserProgress();
    }
  }, []);

  // Save changes to topics in localStorage
  useEffect(() => {
    localStorage.setItem('heritage_topics', JSON.stringify(topics));
  }, [topics]);

  // TTS Engine Methods
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window._activeSpeechUtterance = null;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    }
    setSpeechState({
      isPlaying: false,
      isPaused: false,
      rate: 1,
      currentTopicId: null,
      currentChapterNum: null,
      currentText: ''
    });
  };

  const playSpeech = (text, topicId = selectedTopicId, chapterNum = currentChapterNumber, rate = 1) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('⚠️ Text-to-speech is not supported in this browser.');
      return;
    }

    if (!text) return;

    // In Chromium browsers, ensure any paused speech is resumed before cancelling
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // Retain global reference to prevent premature garbage collection in Chrome
    window._activeSpeechUtterance = utterance;

    // Immediately reflect active playback state in React
    setSpeechState({
      isPlaying: true,
      isPaused: false,
      rate,
      currentTopicId: topicId,
      currentChapterNum: chapterNum,
      currentText: text
    });

    utterance.onstart = () => {
      setSpeechState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        rate,
        currentTopicId: topicId,
        currentChapterNum: chapterNum,
        currentText: text
      }));
    };

    utterance.onend = () => {
      if (window._activeSpeechUtterance === utterance) {
        window._activeSpeechUtterance = null;
        setSpeechState({
          isPlaying: false,
          isPaused: false,
          rate: 1,
          currentTopicId: null,
          currentChapterNum: null,
          currentText: ''
        });
      }
    };

    utterance.onerror = (e) => {
      // Ignore intentional cancellation caused by stopSpeech or rate changes
      if (e && (e.error === 'canceled' || e.error === 'interrupted')) {
        return;
      }
      if (window._activeSpeechUtterance === utterance) {
        window._activeSpeechUtterance = null;
        setSpeechState({
          isPlaying: false,
          isPaused: false,
          rate: 1,
          currentTopicId: null,
          currentChapterNum: null,
          currentText: ''
        });
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setSpeechState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  };

  const resumeSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setSpeechState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      } else if (!window.speechSynthesis.speaking && speechState.currentText) {
        playSpeech(speechState.currentText, speechState.currentTopicId, speechState.currentChapterNum, speechState.rate);
      } else {
        window.speechSynthesis.resume();
        setSpeechState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      }
    }
  };

  useEffect(() => {
    stopSpeech();
  }, [selectedTopicId, currentScreen]);

  const addXP = (amount, activityTitle) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      if (newLevel > prev.level) {
        showToast(`🎉 Level Up! You reached Level ${newLevel}!`);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        showToast(`⭐ +${amount} XP Earned!`);
      }
      return { ...prev, xp: newXP, level: newLevel };
    });

    if (activityTitle) {
      setActivities(prev => [
        { id: Date.now(), title: activityTitle, xp: amount, time: 'Just now' },
        ...prev
      ]);
    }
  };

  const toggleFavorite = (topicId) => {
    setFavorites(prev => {
      if (prev.includes(topicId)) {
        showToast('Removed from favorites');
        return prev.filter(id => id !== topicId);
      } else {
        showToast('❤️ Added to favorites!');
        return [...prev, topicId];
      }
    });
  };

  const markStoryCompleted = async (topicId) => {
    if (!completedStories.includes(topicId)) {
      setCompletedStories(prev => [...prev, topicId]);
      setLastActiveTopicId(topicId);
      const topicObj = topics.find(t => t.id === topicId);
      addXP(20, `Completed Story: ${topicObj?.name || topicId}`);

      try {
        await api.completeStory(topicId);
        refreshUserProgress();
      } catch (e) {
        console.warn('API completeStory call error', e);
      }
    }
  };

  const recordQuizResult = async (topicId, score, total) => {
    const xpEarned = score * 10 + (score === total ? 20 : 0);
    setQuizResults(prev => ({
      ...prev,
      [topicId]: { score, total, xp: xpEarned, date: new Date().toISOString().split('T')[0] }
    }));
    setLastQuizScore({ topicId, score, total, xp: xpEarned });
    setLastActiveTopicId(topicId);
    const topicObj = topics.find(t => t.id === topicId);
    addXP(xpEarned, `Completed Quiz: ${topicObj?.name || topicId}`);

    if (score === total) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    try {
      await api.submitQuiz(topicId, { answers: {} });
      refreshUserProgress();
    } catch (e) {
      console.warn('API submitQuiz call error', e);
    }
  };

  const recordArtifactMatchCompletion = async (topicId, score) => {
    setGameStats(prev => ({
      ...prev,
      artifactMatchCompleted: prev.artifactMatchCompleted + 1,
      totalGamesPlayed: prev.totalGamesPlayed + 1
    }));
    setLastActiveTopicId(topicId);

    try {
      await api.submitArtifactMatchGame(topicId, score);
      refreshUserProgress();
    } catch (e) {
      console.warn('API submitArtifactMatchGame call error', e);
    }
  };

  const recordMemoryGameCompletion = async (topicId, score) => {
    setGameStats(prev => ({
      ...prev,
      memoryGameCompleted: prev.memoryGameCompleted + 1,
      totalGamesPlayed: prev.totalGamesPlayed + 1
    }));
    setLastActiveTopicId(topicId);

    try {
      await api.submitMemoryGame(topicId, score);
      refreshUserProgress();
    } catch (e) {
      console.warn('API submitMemoryGame call error', e);
    }
  };

  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  const logout = () => {
    localStorage.removeItem('heritage_auth_token');
    localStorage.removeItem('heritage_jwt_token');
    localStorage.removeItem('heritage_token');

    setUser({
      id: null,
      name: '',
      joined: 'Oct 2026',
      member_since: 'Oct 2026',
      xp: 0,
      level: 1,
      avatar: '👩‍🎓',
      role: 'Student',
      isLoggedIn: false
    });
    setCompletedStories([]);
    setQuizResults({});
    setGameStats({ artifactMatchCompleted: 0, memoryGameCompleted: 0, totalGamesPlayed: 0 });
    setUnlockedBadges([]);
    setActivities([]);
    setLastActiveTopicId(null);

    showToast('Logged out successfully');
    setCurrentScreen('explore');
  };

  return (
    <AppContext.Provider value={{
      currentScreen, setCurrentScreen,
      topics, setTopics,
      artifactItems, setArtifactItems,
      memoryItems, setMemoryItems,
      user, setUser, logout,
      favorites, toggleFavorite,
      completedStories, markStoryCompleted,
      quizResults, recordQuizResult,
      gameStats, setGameStats, recordArtifactMatchCompletion, recordMemoryGameCompletion,
      unlockedBadges, setUnlockedBadges,
      activities, lastActiveTopicId,
      selectedTopicId, setSelectedTopicId,
      currentChapterNumber, setCurrentChapterNumber,
      quizAnswers, setQuizAnswers,
      lastQuizScore, setLastQuizScore,
      audioModalOpen, setAudioModalOpen,
      speechState, setSpeechState,
      playSpeech, pauseSpeech, resumeSpeech, stopSpeech,
      toastMessage, showToast,
      addXP,
      activeTopic,
      refreshUserProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
