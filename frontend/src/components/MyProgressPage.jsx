import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, BookOpen, HelpCircle, Gamepad2, Award, ArrowRight, Clock, Trophy, Compass } from 'lucide-react';

export const MyProgressPage = () => {
  const { user, completedStories, quizResults, gameStats, unlockedBadges, activities, lastActiveTopicId, topics, setSelectedTopicId, setCurrentScreen } = useApp();

  const currentLevelProgressPercent = Math.min(100, Math.round(((user.xp % 100) / 100) * 100));

  const lastActiveTopic = lastActiveTopicId 
    ? topics.find(t => t.id === lastActiveTopicId) 
    : (completedStories.length > 0 ? topics.find(t => t.id === completedStories[completedStories.length - 1]) : null);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-left">
      
      {/* User Header Profile Banner matching Screen 10 in mockup */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-md border-2 border-amber-300">
            {user.avatar || '👩‍🎓'}
          </div>
          <div className="space-y-1">
            <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold">{user.name || 'Heritage Explorer'}</h1>
            <p className="text-xs text-amber-200 font-medium">Role: {user.role || 'Student'} • Member since {user.joined || user.member_since || 'Oct 2026'}</p>
            <div className="inline-flex items-center space-x-2 bg-amber-700/80 px-3 py-1 rounded-full text-xs font-bold text-amber-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{user.xp || 0} XP</span>
              <span>• Level {user.level || 1}</span>
            </div>
          </div>
        </div>

        {/* Level Progress Indicator matching Screen 10 */}
        <div className="w-full sm:w-64 bg-amber-900/60 p-4 rounded-2xl border border-amber-700/60 space-y-2">
          <div className="flex justify-between text-xs font-bold text-amber-200">
            <span>Level {user.level || 1}</span>
            <span>{currentLevelProgressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-amber-950/80 rounded-full overflow-hidden border border-amber-700">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${currentLevelProgressPercent}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-amber-300/80 font-medium text-right">
            Progress to Level {(user.level || 1) + 1}
          </p>
        </div>

      </div>

      {/* 4 Core Stat Cards matching Screen 10 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl font-bold">
            📚
          </div>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Stories Completed</span>
          <span className="font-cinzel text-2xl font-extrabold text-amber-950">{completedStories.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center text-xl font-bold">
            🧠
          </div>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Quizzes Completed</span>
          <span className="font-cinzel text-2xl font-extrabold text-amber-950">{Object.keys(quizResults).length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center text-xl font-bold">
            🎮
          </div>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Games Completed</span>
          <span className="font-cinzel text-2xl font-extrabold text-amber-950">{gameStats.totalGamesPlayed || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-900 flex items-center justify-center text-xl font-bold">
            🏆
          </div>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Badges Earned</span>
          <span className="font-cinzel text-2xl font-extrabold text-amber-950">{unlockedBadges.length}</span>
        </div>

      </div>

      {/* Two Column Progress Layout matching Screen 10 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Continue Your Journey Card */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="font-cinzel text-lg font-bold text-amber-950 border-b border-amber-100 pb-2">
            Continue Your Journey
          </h3>

          {lastActiveTopic ? (
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <img
                src={lastActiveTopic.coverImage || lastActiveTopic.cover_image}
                alt={lastActiveTopic.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800">{lastActiveTopic.state || 'Heritage'}</span>
                <h4 className="font-cinzel text-base font-bold text-amber-950">{lastActiveTopic.name}</h4>
                <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-700 h-full w-[60%]"></div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTopicId(lastActiveTopic.id);
                  setCurrentScreen('story');
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold shadow-xs hover:bg-amber-900"
              >
                Resume
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-50/40 border border-dashed border-amber-300 text-center space-y-3">
              <Compass className="w-10 h-10 text-amber-700 mx-auto opacity-70" />
              <div className="space-y-1">
                <h4 className="font-cinzel text-base font-bold text-amber-950">Start Exploring</h4>
                <p className="text-xs text-amber-900/70">
                  You haven't started any heritage stories yet. Begin your cultural journey today!
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen('explore')}
                className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold shadow-xs hover:bg-amber-900 inline-flex items-center gap-1.5"
              >
                <span>Explore Topics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity Timeline matching Screen 10 */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="font-cinzel text-lg font-bold text-amber-950 border-b border-amber-100 pb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-700" /> Recent Activity
          </h3>

          {activities && activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-50/40 border border-amber-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-950 block">{act.title}</span>
                    <span className="text-[10px] text-amber-800">{act.time}</span>
                  </div>
                  {act.xp > 0 && (
                    <span className="font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full text-[10px]">
                      +{act.xp} XP
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-50/40 border border-dashed border-amber-200 text-center space-y-1.5 text-xs text-amber-900/70">
              <p className="font-semibold text-amber-950">No activity yet</p>
              <p>Your activity will appear here once you explore stories, quizzes, or games.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
