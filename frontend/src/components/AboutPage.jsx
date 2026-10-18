import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  const { setCurrentScreen } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16 text-left">
      
      {/* Hero Header */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-amber-200/90 shadow-md space-y-4">
        <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>About Heritage Storyteller</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-amber-950">
          Our Heritage. Your Story.
        </h1>
        <p className="text-sm sm:text-base text-amber-900/80 leading-relaxed font-medium">
          Heritage Storyteller is an interactive educational platform designed to make Indian history, civilization, traditions, art, crafts, monuments and cultural practices memorable for young learners.
        </p>
      </div>

      {/* Two Columns: Why We Created It & How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Why We Created It */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="font-cinzel text-xl font-bold text-amber-950 border-b border-amber-100 pb-3">
            Why We Created It
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm font-medium text-amber-950/80">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>Make heritage learning interactive instead of long textbook reading.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>Encourage cultural curiosity among students and young minds.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>Make complex historical information visual and easy to remember.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>Combine formal education with gamified play rewards.</span>
            </li>
          </ul>
        </div>

        {/* How It Works Flow */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="font-cinzel text-xl font-bold text-amber-950 border-b border-amber-100 pb-3">
            How It Works
          </h3>
          <div className="space-y-3 text-xs sm:text-sm font-bold text-amber-950">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center">1</span>
              <span>Discover Heritage Topics & Visual Stories</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center">2</span>
              <span>Listen to Text-to-Speech Narration of Chapters</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center">3</span>
              <span>Test Knowledge via 5-question Quizzes</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center">4</span>
              <span>Play Artifact Match & Memory Games to Remember</span>
            </div>
          </div>
        </div>

      </div>

      {/* Future Scope Section */}
      <div className="bg-amber-50/80 p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xs space-y-3">
        <h3 className="font-cinzel text-lg font-bold text-amber-950 flex items-center gap-2">
          <span>🔮</span>
          <span>Future Scope</span>
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm font-medium text-amber-900">
          <li className="flex items-center space-x-2">
            <span className="text-amber-700 font-bold">•</span>
            <span>Support for Hindi, Marathi and other Indian languages.</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-amber-700 font-bold">•</span>
            <span>AI-driven personalized heritage recommendation engine.</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-amber-700 font-bold">•</span>
            <span>3D Augmented Reality (AR) 360° monument exploration.</span>
          </li>
        </ul>
      </div>

      {/* Our Core Goals Bar */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white p-8 rounded-3xl shadow-md text-center space-y-4">
        <h3 className="font-cinzel text-2xl font-bold">Our Core Goals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs">
          <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-700/60">
            <span className="text-2xl block mb-1">💡</span>
            <span className="font-bold text-amber-200 block text-sm">Engage Learners</span>
            <p className="opacity-90">Spark excitement through visual stories and interactive mini-games.</p>
          </div>
          <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-700/60">
            <span className="text-2xl block mb-1">🎓</span>
            <span className="font-bold text-amber-200 block text-sm">Support Education</span>
            <p className="opacity-90">Provide verified supplementary material for schools and parents.</p>
          </div>
          <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-700/60">
            <span className="text-2xl block mb-1">🛕</span>
            <span className="font-bold text-amber-200 block text-sm">Preserve Culture</span>
            <p className="opacity-90">Pass down ancient Indian wisdom and heritage to future generations.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
