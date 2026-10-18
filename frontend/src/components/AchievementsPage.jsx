import React from 'react';
import { useApp } from '../context/AppContext';
import { BADGES_LIST } from '../data/heritageData';
import { Award, Lock, CheckCircle2, Sparkles, Trophy } from 'lucide-react';

export const AchievementsPage = () => {
  const { unlockedBadges } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-center">
      
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-900">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>Cultural Milestones</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-950">
          YOUR ACHIEVEMENTS
        </h1>
        <p className="text-xs sm:text-sm text-amber-900/80 font-medium">
          Earn badges by discovering stories, mastering quizzes, and playing heritage games!
        </p>
      </div>

      {/* Badges Grid matching Screen 11 in mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {BADGES_LIST.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border transition-all duration-300 relative space-y-4 ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-md hover:shadow-xl'
                  : 'bg-gray-50/70 border-gray-200 opacity-70 grayscale-50'
              }`}
            >
              {/* Unlocked / Locked Status Indicator */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                  isUnlocked ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  {badge.level}
                </span>

                {isUnlocked ? (
                  <span className="flex items-center text-xs font-bold text-emerald-700 gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                  </span>
                ) : (
                  <span className="flex items-center text-xs font-bold text-gray-500 gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" /> Locked
                  </span>
                )}
              </div>

              {/* Badge Icon Circle */}
              <div className="flex justify-center py-2">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md border-4 ${
                  isUnlocked ? 'border-amber-400 bg-gradient-to-br from-amber-100 to-amber-200 scale-105' : 'border-gray-300 bg-gray-100'
                }`}>
                  {badge.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-center space-y-1">
                <h3 className="font-cinzel text-lg font-bold text-amber-950">
                  {badge.name}
                </h3>
                <p className="text-xs text-amber-900/70 font-medium leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-2 border-t border-amber-100">
                <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isUnlocked ? 'bg-amber-700 w-full' : 'bg-gray-400 w-1/2'}`}
                  ></div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
