import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { Gamepad2, CheckCircle2, RotateCcw, ArrowRight, Trophy, Sparkles } from 'lucide-react';

export const ArtifactMatchGame = () => {
  const { artifactItems, addXP, setGameStats, recordArtifactMatchCompletion, selectedTopicId, setCurrentScreen } = useApp();

  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [userPairs, setUserPairs] = useState({}); // { artifactId: targetName }
  const [matchedStatus, setMatchedStatus] = useState({}); // { artifactId: true/false }
  const [gameFinished, setGameFinished] = useState(false);
  const [score, setScore] = useState(0);

  const targets = Array.from(new Set(artifactItems.map(item => item.targetName)));

  const handleArtifactSelect = (item) => {
    if (gameFinished) return;
    setSelectedArtifact(item);
  };

  const handleTargetClick = (targetName) => {
    if (!selectedArtifact || gameFinished) return;
    
    // Pair artifact to target
    const isCorrect = selectedArtifact.targetName === targetName;
    
    setUserPairs(prev => ({
      ...prev,
      [selectedArtifact.id]: targetName
    }));

    setMatchedStatus(prev => ({
      ...prev,
      [selectedArtifact.id]: isCorrect
    }));

    if (isCorrect) {
      addXP(10, `Matched Artifact: ${selectedArtifact.artifactName}`);
      setScore(prev => prev + 1);
    }

    setSelectedArtifact(null);

    // Check if all matched
    const newMatchedCount = Object.keys(userPairs).length + 1;
    if (newMatchedCount >= artifactItems.length) {
      setGameFinished(true);
      addXP(30, 'Completed Artifact Match Game!');
      if (recordArtifactMatchCompletion) {
        recordArtifactMatchCompletion(selectedTopicId || 'warli-art', 100);
      } else {
        setGameStats(prev => ({
          ...prev,
          artifactMatchCompleted: prev.artifactMatchCompleted + 1,
          totalGamesPlayed: prev.totalGamesPlayed + 1
        }));
      }
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  };


  const resetGame = () => {
    setSelectedArtifact(null);
    setUserPairs({});
    setMatchedStatus({});
    setGameFinished(false);
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-left">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('memory-game')}
          className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <span>Switch to Heritage Memory Game</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={resetGame}
          className="px-3.5 py-1.5 rounded-lg border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Game Box matching Screen 8 in mockup */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-md space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-700 uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 text-amber-600" />
              <span>Mini-Game 1</span>
            </div>
            <h2 className="font-cinzel text-2xl font-extrabold text-amber-950">
              Artifact Match
            </h2>
            <p className="text-xs text-amber-900/70 font-medium">
              Click an artifact on the left, then click its corresponding tradition on the right!
            </p>
          </div>

          <div className="bg-amber-100/90 border border-amber-300 px-4 py-2 rounded-2xl text-right">
            <span className="text-xs font-bold text-amber-900 block">Score</span>
            <span className="font-cinzel text-xl font-bold text-amber-950">{score} / {artifactItems.length}</span>
          </div>
        </div>

        {/* Matching Interactive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Artifacts Column matching Screen 8 */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-amber-900 uppercase tracking-wider">
              CULTURAL ARTIFACTS
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {artifactItems.map((item) => {
                const isSelected = selectedArtifact?.id === item.id;
                const pairedTarget = userPairs[item.id];
                const isCorrect = matchedStatus[item.id];

                return (
                  <div
                    key={item.id}
                    onClick={() => handleArtifactSelect(item)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer space-y-2 relative ${
                      isSelected
                        ? 'bg-amber-200 border-amber-600 ring-2 ring-amber-500/30 scale-105 shadow-md'
                        : pairedTarget
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-300 opacity-90'
                          : 'bg-red-50 border-red-300 opacity-90'
                        : 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/70'
                    }`}
                  >
                    <div className="text-3xl">{item.artifactIcon}</div>
                    <p className="font-bold text-xs text-amber-950">{item.artifactName}</p>
                    {pairedTarget && (
                      <span className={`text-[10px] font-bold block ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                        → {pairedTarget}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Traditions Column matching Screen 8 */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-amber-900 uppercase tracking-wider">
              CULTURAL TRADITIONS
            </h4>

            <div className="space-y-2.5">
              {targets.map((targetName) => (
                <button
                  key={targetName}
                  onClick={() => handleTargetClick(targetName)}
                  disabled={!selectedArtifact}
                  className={`w-full p-4 rounded-2xl border font-bold text-xs text-left transition-all flex items-center justify-between ${
                    selectedArtifact
                      ? 'bg-amber-100/90 border-amber-400 hover:bg-amber-200 cursor-pointer shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-amber-900/60'
                  }`}
                >
                  <span className="text-sm font-bold text-amber-950">🎯 {targetName}</span>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-200 px-2.5 py-1 rounded-full text-amber-950">
                    Match
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Completion Banner */}
        {gameFinished && (
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-300 text-center space-y-3">
            <div className="text-3xl">🎉</div>
            <h3 className="font-cinzel text-xl font-bold text-emerald-950">Match Challenge Completed!</h3>
            <p className="text-xs text-emerald-800 font-semibold">You earned +30 XP bonus for completing Artifact Match!</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={resetGame}
                className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-950 text-xs font-bold hover:bg-emerald-100"
              >
                Play Again
              </button>
              <button
                onClick={() => setCurrentScreen('memory-game')}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-xs"
              >
                Play Memory Game →
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
