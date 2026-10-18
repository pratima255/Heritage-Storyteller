import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, Play, Pause, SkipBack, SkipForward, X, RotateCcw } from 'lucide-react';

export const AudioStoryModal = () => {
  const { 
    audioModalOpen, 
    setAudioModalOpen, 
    activeTopic, 
    currentChapterNumber,
    speechState,
    playSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  } = useApp();

  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime] = useState(120);

  const chapter = activeTopic.chapters?.find(c => c.number === currentChapterNumber) || activeTopic.chapters?.[0];
  const chapterText = `${activeTopic.name}. Chapter ${chapter?.number || 1}. ${chapter?.title || ''}. ${chapter?.content || ''}`;

  // When modal opens or chapter changes, start reading if not already speaking this chapter
  useEffect(() => {
    if (audioModalOpen) {
      setCurrentTime(0);
      const isAlreadySpeakingThisChapter = speechState.isPlaying &&
        speechState.currentTopicId === activeTopic.id &&
        speechState.currentChapterNum === currentChapterNumber;

      if (!isAlreadySpeakingThisChapter) {
        playSpeech(chapterText, activeTopic.id, currentChapterNumber, speed);
      }
    }
  }, [audioModalOpen, currentChapterNumber, activeTopic.id]);

  useEffect(() => {
    let timer;
    if (speechState.isPlaying && currentTime < totalTime) {
      timer = setInterval(() => setCurrentTime(prev => prev + 1), 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [speechState.isPlaying, currentTime, totalTime, speed]);

  if (!audioModalOpen) return null;

  const togglePlay = () => {
    if (speechState.isPlaying) {
      pauseSpeech();
    } else if (speechState.isPaused) {
      resumeSpeech();
    } else {
      playSpeech(chapterText, activeTopic.id, currentChapterNumber, speed);
    }
  };

  const handleSpeedChange = () => {
    const newSpeed = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1;
    setSpeed(newSpeed);
    if (speechState.isPlaying) {
      playSpeech(chapterText, activeTopic.id, currentChapterNumber, newSpeed);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    playSpeech(chapterText, activeTopic.id, currentChapterNumber, speed);
  };

  const handleClose = () => {
    stopSpeech();
    setAudioModalOpen(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/60 backdrop-blur-xs p-4">
      <div className="bg-[#faf8f2] w-full max-w-lg rounded-3xl border border-amber-300 shadow-2xl p-6 space-y-6 relative text-left">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-200/60 text-amber-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-700 uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Now Playing Audio Narration</span>
          </div>
          <h3 className="font-cinzel text-xl font-bold text-amber-950">
            {chapter?.title || activeTopic.name}
          </h3>
          <p className="text-xs text-amber-900/70 font-medium">
            {activeTopic.name} • Chapter {chapter?.number || 1}
          </p>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="bg-amber-100/60 p-6 rounded-2xl border border-amber-200 flex items-center justify-center space-x-1.5 h-24">
          {[40, 70, 30, 90, 60, 100, 50, 80, 40, 90, 60, 30, 80, 50, 90, 40, 70, 30].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-amber-700 rounded-full transition-all duration-300"
              style={{
                height: speechState.isPlaying ? `${Math.max(15, (h * (i % 2 === 0 ? 0.9 : 0.6)))}%` : '15%'
              }}
            ></div>
          ))}
        </div>

        {/* Time Progress Scrubber */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max={totalTime}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full accent-amber-700 cursor-pointer"
          />
          <div className="flex justify-between text-xs font-bold text-amber-900">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="flex items-center justify-center space-x-6 pt-2">
          <button
            onClick={handleSpeedChange}
            className="px-3 py-1.5 rounded-xl bg-amber-200 text-amber-950 text-xs font-bold hover:bg-amber-300"
          >
            {speed}x Speed
          </button>

          <button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            className="p-3 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-amber-800 hover:bg-amber-900 text-white shadow-lg transform active:scale-95 transition-all"
          >
            {speechState.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
          </button>

          <button
            onClick={() => setCurrentTime(Math.min(totalTime, currentTime + 10))}
            className="p-3 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={handleRestart}
            className="p-2.5 rounded-xl text-amber-900 hover:bg-amber-100"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
