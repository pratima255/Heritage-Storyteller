import React from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, Play, CheckCircle2, ArrowLeft, Heart, Share2, Compass, Tag, MapPin, Sparkles } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80";

export const HeritageDetailsPage = () => {
  const { activeTopic, setCurrentScreen, setCurrentChapterNumber, favorites, toggleFavorite, playSpeech, setAudioModalOpen } = useApp();

  const isFav = favorites.includes(activeTopic.id);

  const handleListenClick = () => {
    const chapter1 = activeTopic.chapters?.[0];
    if (chapter1) {
      const textToSpeak = `${activeTopic.name}. ${chapter1.title}. ${chapter1.audioScript || chapter1.content}`;
      playSpeech(textToSpeak, activeTopic.id, 1, 1);
      setAudioModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('explore')}
          className="px-3.5 py-1.5 rounded-lg bg-amber-100/70 hover:bg-amber-200/80 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explorer</span>
        </button>

        <button
          onClick={() => toggleFavorite(activeTopic.id)}
          className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
            isFav
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-600' : ''}`} />
          <span>{isFav ? 'Saved Favorite' : 'Save Favorite'}</span>
        </button>
      </div>

      {/* Hero Header Section matching Screen 3 in image */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-200">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={activeTopic.cover_image || activeTopic.coverImage || activeTopic.bannerImage || DEFAULT_FALLBACK_IMAGE}
            alt={activeTopic.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500 text-amber-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {activeTopic.categoryLabel}
              </span>
              <span className="text-xs font-semibold text-amber-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {activeTopic.state}
              </span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
              {activeTopic.name}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl font-medium leading-relaxed">
              {activeTopic.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Main Information Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Action Header Buttons */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-amber-950">Ready to Discover?</h3>
              <p className="text-xs text-amber-900/70 font-medium">Read chapter by chapter or listen to audio narration.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleListenClick}
                className="px-5 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold border border-amber-300 flex items-center space-x-2 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>Listen Audio</span>
              </button>
              <button
                onClick={() => {
                  setCurrentChapterNumber(1);
                  setCurrentScreen('story');
                }}
                className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-md flex items-center space-x-2 transition-colors"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Story →</span>
              </button>
            </div>
          </div>

          {/* About the Tradition */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
            <h3 className="font-cinzel text-xl font-bold text-amber-950 border-b border-amber-100 pb-3">
              About the Tradition
            </h3>
            <p className="text-sm text-amber-950/80 leading-relaxed font-medium">
              {activeTopic.historicalBackground}
            </p>
          </div>

          {/* Related Traditions Tags */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-700" /> Related Traditions & Concepts
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeTopic.relatedTraditions?.map((trad, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-bold"
                >
                  ✨ {trad}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar Quick Info & Story Chapter List */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Info Sidebar matching Screen 3 in image */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
            <h3 className="font-cinzel text-base font-bold text-amber-950 border-b border-amber-100 pb-2">
              Quick Info
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-amber-900 block">🏛️ Origin:</span>
                <span className="text-amber-950 font-medium">{activeTopic.origin}</span>
              </div>
              <div>
                <span className="font-bold text-amber-900 block">📍 Region / State:</span>
                <span className="text-amber-950 font-medium">{activeTopic.region}</span>
              </div>
              <div>
                <span className="font-bold text-amber-900 block">🎨 Art Style / Category:</span>
                <span className="text-amber-950 font-medium">{activeTopic.artStyle}</span>
              </div>
            </div>
          </div>

          {/* Story Journey Chapter List matching Screen 3 */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <h3 className="font-cinzel text-base font-bold text-amber-950">Your Story Journey</h3>
              <span className="text-xs font-bold text-amber-700">5 Chapters</span>
            </div>

            <div className="space-y-2">
              {activeTopic.chapters?.map((chap) => (
                <div
                  key={chap.id}
                  onClick={() => {
                    setCurrentChapterNumber(chap.number);
                    setCurrentScreen('story');
                  }}
                  className="p-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/60 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                      {chap.number}
                    </span>
                    <span className="text-xs font-bold text-amber-950 group-hover:text-amber-700 transition-colors">
                      {chap.title}
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-amber-400 group-hover:text-amber-600" />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentChapterNumber(1);
                setCurrentScreen('story');
              }}
              className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Start Chapter 1 →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
