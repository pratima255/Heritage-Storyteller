import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Gamepad2, Award } from 'lucide-react';

export const QuizResultPage = () => {
  const { lastQuizScore, activeTopic, setCurrentScreen, unlockedBadges } = useApp();

  const [showReview, setShowReview] = useState(false);

  const score = lastQuizScore?.score ?? 4;
  const total = lastQuizScore?.total ?? 5;
  const percentage = Math.round((score / total) * 100);
  const xpEarned = lastQuizScore?.xp ?? 40;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 text-center">
      
      {/* Quiz Result Card matching Screen 7 in mockup */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200/90 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Background glow motif */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/20 blur-3xl rounded-full"></div>

        {/* Trophy Header */}
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-4xl shadow-lg border-2 border-amber-200 animate-bounce">
            🏆
          </div>
          <h1 className="font-cinzel text-3xl font-extrabold text-amber-950 tracking-tight">
            QUIZ COMPLETE!
          </h1>
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">{activeTopic.name}</p>
        </div>

        {/* Score Display Card */}
        <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200/80 space-y-3">
          <div className="font-cinzel text-5xl font-extrabold text-amber-950">
            {score} <span className="text-2xl text-amber-700">/ {total}</span>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm font-bold text-amber-800">⭐ {percentage}% Score</span>
            <span className="bg-amber-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              +{xpEarned} XP earned
            </span>
          </div>

          <div className="flex justify-center items-center space-x-4 pt-2 text-xs font-bold">
            <span className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {score} Correct
            </span>
            <span className="text-red-700 flex items-center gap-1">
              <XCircle className="w-4 h-4 text-red-600" /> {total - score} Incorrect
            </span>
          </div>
        </div>

        {/* Action Buttons matching Screen 7 */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setShowReview(!showReview)}
            className="px-5 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs border border-amber-300 transition-colors"
          >
            {showReview ? 'Hide Answers' : 'Review Answers'}
          </button>

          <button
            onClick={() => setCurrentScreen('artifact-match')}
            className="px-7 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Gamepad2 className="w-4 h-4 text-amber-200" />
            <span>Play Heritage Game →</span>
          </button>
        </div>

        {/* Achievement Progress Bar matching Screen 7 */}
        <div className="pt-6 border-t border-amber-100 text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-950">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-700" /> Culture Seeker Badge Progress
            </span>
            <span>80%</span>
          </div>
          <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-700 w-[80%] rounded-full"></div>
          </div>
        </div>

      </div>

      {/* Review Answers Drawer */}
      {showReview && (
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md text-left space-y-4">
          <h3 className="font-cinzel text-lg font-bold text-amber-950 border-b border-amber-100 pb-2">
            Quiz Answer Key & Explanations
          </h3>
          <div className="space-y-4">
            {(activeTopic.quizzes || activeTopic.quiz)?.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1 text-xs">
                <p className="font-bold text-amber-950">{idx + 1}. {q.question}</p>
                <p className="text-emerald-700 font-bold">Correct: {q.correctAnswer || q.correct_answer}</p>
                <p className="text-amber-900/80 italic">{q.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
