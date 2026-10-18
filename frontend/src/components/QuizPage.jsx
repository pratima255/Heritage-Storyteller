import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ArrowLeft, ArrowRight, CheckCircle2, Award } from 'lucide-react';

export const QuizPage = () => {
  const { activeTopic, setCurrentScreen, recordQuizResult } = useApp();

  const questions = activeTopic?.quizzes || activeTopic?.quiz || activeTopic?.quiz_questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-white rounded-3xl border border-amber-200 p-8 space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-amber-950">Quiz Coming Soon</h2>
        <p className="text-xs text-amber-800">Quiz questions for {activeTopic?.name || 'this topic'} are being curated.</p>
        <button
          onClick={() => setCurrentScreen('explore')}
          className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-all"
        >
          Back to Explorer
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex] || questions[0] || {};
  const optionsList = currentQ.options || [currentQ.option_a, currentQ.option_b, currentQ.option_c, currentQ.option_d].filter(Boolean);

  const handleOptionSelect = (optionStr) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionStr
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finish Quiz
      let score = 0;
      questions.forEach((q, idx) => {
        const correct = q.correctAnswer || q.correct_answer;
        if (selectedAnswers[idx] === correct) score += 1;
      });
      
      recordQuizResult(activeTopic.id, score, questions.length);
      setCurrentScreen('quiz-result');
    }
  };

  const selectedForCurrent = selectedAnswers[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-left">
      
      {/* Top Header Navigation matching Screen 6 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('story')}
          className="px-3.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Story</span>
        </button>

        <div className="text-xs font-extrabold text-amber-900 bg-amber-200/80 px-4 py-1.5 rounded-full border border-amber-300">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Main Quiz Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md p-6 sm:p-8 space-y-6">
        
        {/* Title */}
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{activeTopic.name}</span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1">
            Test Your Knowledge
          </h2>
        </div>

        {/* Question + Illustration Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Question and Radio Options */}
          <div className="md:col-span-8 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-amber-950 leading-snug">
              {currentQ.question}
            </h3>

            {/* 4 Multiple Choice Options matching Screen 6 */}
            <div className="space-y-3">
              {optionsList.map((option, idx) => {
                const isSelected = selectedForCurrent === option;
                return (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-amber-100/90 border-amber-600 shadow-xs ring-2 ring-amber-500/20'
                        : 'bg-amber-50/50 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-amber-700 bg-amber-700 text-white' : 'border-amber-400 bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-amber-950">{option}</span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs ${
                  currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed bg-amber-100 text-amber-800' : 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={!selectedForCurrent}
                className={`px-7 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2 ${
                  selectedForCurrent
                    ? 'bg-amber-800 hover:bg-amber-900 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Submit Quiz →' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Topic Art Illustration matching Screen 6 */}
          <div className="md:col-span-4 bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center space-y-3">
            <img
              src={activeTopic.coverImage || activeTopic.cover_image}
              alt={activeTopic.name}
              className="w-full h-44 object-cover rounded-xl shadow-xs"
            />
            <p className="text-xs text-amber-900 font-bold">{activeTopic.name} Challenge</p>
            <p className="text-[11px] text-amber-800/80">Earn up to +50 XP for a perfect score!</p>
          </div>

        </div>

      </div>

    </div>
  );
};
