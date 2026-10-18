import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Compass, BookOpen, Shield, Award } from 'lucide-react';

export const Footer = () => {
  const { setCurrentScreen } = useApp();

  return (
    <footer className="bg-[#f3ede0] border-t border-[#e2d6c1] text-amber-950 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Decorative Top Motif Border */}
        <div className="flex items-center justify-center space-x-4 mb-8 text-amber-700/40">
          <div className="h-px bg-amber-300 flex-1"></div>
          <span className="text-xl">🛕 🎨 📜 🪘 💃 🛕</span>
          <div className="h-px bg-amber-300 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold text-lg">
                🛕
              </div>
              <span className="font-cinzel text-lg font-bold text-amber-950">Heritage Storyteller</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Discover India's rich history, culture, art and traditions through short interactive visual stories, quizzes and mini-games.
            </p>
            <div className="text-xs font-semibold text-amber-800 italic">
              « Discover • Listen • Learn • Quiz • Play • Remember »
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel font-bold text-sm text-amber-950 uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium text-amber-900/80">
              <li>
                <button onClick={() => setCurrentScreen('explore')} className="hover:text-amber-950 transition-colors">
                  Explore Heritage Topics
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentScreen('artifact-match')} className="hover:text-amber-950 transition-colors">
                  Artifact Match Game
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentScreen('memory-game')} className="hover:text-amber-950 transition-colors">
                  Heritage Memory Game
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentScreen('achievements')} className="hover:text-amber-950 transition-colors">
                  Achievements & Badges
                </button>
              </li>
            </ul>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-cinzel font-bold text-sm text-amber-950 uppercase tracking-wider mb-3">Featured Topics</h4>
            <ul className="space-y-2 text-xs font-medium text-amber-900/80">
              <li><span>🎨 Warli Tribal Art (Maharashtra)</span></li>
              <li><span>🏛️ Ajanta Caves Murals (Maharashtra)</span></li>
              <li><span>🏰 Maratha Fortresses (Sahyadri)</span></li>
              <li><span>🧵 Paithani Queen of Silks</span></li>
              <li><span>💃 Lavani Folk Rhythms</span></li>
            </ul>
          </div>

          {/* Admin & Educational Info */}
          <div>
            <h4 className="font-cinzel font-bold text-sm text-amber-950 uppercase tracking-wider mb-3">Education & Admin</h4>
            <p className="text-xs text-amber-900/80 leading-relaxed mb-3">
              Designed as a modern college educational software project inspired by Indian culture and heritage.
            </p>
            <button
              onClick={() => setCurrentScreen('admin-dashboard')}
              className="inline-flex items-center space-x-1.5 bg-amber-200/70 border border-amber-300 text-amber-950 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-amber-300 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Content Panel</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-amber-200/80 text-center text-xs text-amber-900/70 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Heritage Storyteller. Built for Young Indian Learners.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" /> for Indian Civilization & Culture
          </p>
        </div>

      </div>
    </footer>
  );
};
