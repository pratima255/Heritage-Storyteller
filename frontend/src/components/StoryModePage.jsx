import React from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, ArrowLeft, ArrowRight, Lightbulb, Play, Pause, Square } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80";

export const StoryModePage = () => {
  const { 
    activeTopic, 
    currentChapterNumber, 
    setCurrentChapterNumber, 
    setCurrentScreen, 
    markStoryCompleted, 
    setAudioModalOpen,
    speechState,
    playSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  } = useApp();

  const chapters = activeTopic.chapters || [];
  const currentChapter = chapters.find(c => c.number === currentChapterNumber) || chapters[0] || {};
  const progressPercent = Math.round((currentChapterNumber / (chapters.length || 1)) * 100);

  const isCurrentSpeaking = speechState.currentTopicId === activeTopic.id && speechState.currentChapterNum === currentChapterNumber;

  const handleListenButtonClick = () => {
    const textToSpeak = `${activeTopic.name}. Chapter ${currentChapter.number}. ${currentChapter.title}. ${currentChapter.content}`;
    if (!speechState.isPlaying) {
      playSpeech(textToSpeak, activeTopic.id, currentChapterNumber, speechState.rate || 1);
    }
    setAudioModalOpen(true);
  };

  const handleNext = () => {
    stopSpeech();
    if (currentChapterNumber < chapters.length) {
      setCurrentChapterNumber(prev => prev + 1);
    } else {
      markStoryCompleted(activeTopic.id);
      setCurrentScreen('quiz');
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (currentChapterNumber > 1) {
      setCurrentChapterNumber(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-left">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopSpeech();
            setCurrentScreen('details');
          }}
          className="px-3.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeTopic.name}</span>
        </button>

        <div className="text-xs font-extrabold text-amber-900 bg-amber-200/80 px-4 py-1.5 rounded-full border border-amber-300">
          Chapter {currentChapterNumber} of {chapters.length}
        </div>
      </div>

      {/* Main Chapter Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md space-y-6 p-6 sm:p-8">
        
        {/* Chapter Illustration Image */}
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-inner border border-amber-100">
          <img
            src={activeTopic?.cover_image || activeTopic?.coverImage || DEFAULT_FALLBACK_IMAGE}
            alt={activeTopic?.name || 'Topic Cover Image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
            }}
          />
          <div className="absolute top-3 left-3 bg-amber-950/80 text-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-xs">
            {activeTopic.name} • Chapter {currentChapter.number}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Main Chapter Story Text */}
          <div className="md:col-span-8 space-y-4">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-amber-950">
              {currentChapter.title}
            </h2>
            
            <p className="text-sm sm:text-base text-amber-950/90 leading-relaxed font-medium">
              {currentChapter.content}
            </p>

            {/* English Text-to-Speech Controls */}
            <div className="pt-4 border-t border-amber-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleListenButtonClick}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-xs ${
                    isCurrentSpeaking && speechState.isPlaying
                      ? 'bg-amber-900 text-amber-100 animate-pulse'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>
                    {isCurrentSpeaking && speechState.isPlaying
                      ? 'Now Playing (Open Player)'
                      : 'Listen to Story'}
                  </span>
                </button>

                {(isCurrentSpeaking && (speechState.isPlaying || speechState.isPaused)) && (
                  <button
                    onClick={stopSpeech}
                    className="p-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 text-xs font-bold transition-colors"
                    title="Stop Narration"
                  >
                    <Square className="w-4 h-4 fill-red-800 text-red-800" />
                  </button>
                )}
              </div>

              <button
                onClick={handleListenButtonClick}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline"
              >
                Open Audio Player
              </button>
            </div>
          </div>

          {/* Right "Did You Know?" Tip Box */}
          <div className="md:col-span-4 bg-amber-50 p-5 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Did You Know?</span>
            </div>
            <p className="text-xs text-amber-950/80 leading-relaxed font-medium">
              {currentChapter.didYouKnow}
            </p>
          </div>

        </div>

        {/* Chapter Progress Bar */}
        <div className="space-y-2 pt-4 border-t border-amber-100">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>Chapter {currentChapterNumber} / {chapters.length}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200/60">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-700 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={currentChapterNumber === 1}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              currentChapterNumber === 1
                ? 'opacity-40 cursor-not-allowed bg-amber-100 text-amber-800'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-7 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <span>{currentChapterNumber === chapters.length ? 'Take Quiz →' : 'Next Chapter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
