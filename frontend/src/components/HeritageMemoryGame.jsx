import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Gamepad2, Sparkles, ArrowRight } from 'lucide-react';

export const HeritageMemoryGame = () => {
  const { memoryItems, addXP, setGameStats, recordMemoryGameCompletion, selectedTopicId, setCurrentScreen } = useApp();


  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize and shuffle cards
  useEffect(() => {
    resetGame();
  }, [memoryItems]);

  const resetGame = () => {
    const shuffled = [...memoryItems]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({ ...item, instanceId: `${item.id}-${index}` }));
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsCompleted(false);
  };

  const handleCardClick = (card) => {
    if (flippedCards.length === 2 || flippedCards.some(c => c.instanceId === card.instanceId) || matchedPairs.includes(card.pairId)) {
      return;
    }

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);

      if (newFlipped[0].pairId === newFlipped[1].pairId) {
        // Match found!
        const newMatched = [...matchedPairs, newFlipped[0].pairId];
        setMatchedPairs(newMatched);
        setFlippedCards([]);
        addXP(10, `Matched Memory Pair: ${newFlipped[0].title}`);

        if (newMatched.length === memoryItems.length / 2) {
          setIsCompleted(true);
          addXP(30, 'Completed Heritage Memory Board!');
          if (recordMemoryGameCompletion) {
            recordMemoryGameCompletion(selectedTopicId || 'warli-art', 100);
          } else {
            setGameStats(prev => ({
              ...prev,
              memoryGameCompleted: prev.memoryGameCompleted + 1,
              totalGamesPlayed: prev.totalGamesPlayed + 1
            }));
          }
          confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
        }

      } else {
        // Not a match, flip back after 1 second
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-left">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('artifact-match')}
          className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-colors"
        >
          ← Switch to Artifact Match
        </button>

        <button
          onClick={resetGame}
          className="px-3.5 py-1.5 rounded-lg border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Game</span>
        </button>
      </div>

      {/* Main Game Container matching Screen 9 in mockup */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-md space-y-6">
        
        {/* Header and Stats matching Screen 9 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-700 uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 text-amber-600" />
              <span>Mini-Game 2</span>
            </div>
            <h2 className="font-cinzel text-2xl font-extrabold text-amber-950">
              Heritage Memory
            </h2>
            <p className="text-xs text-amber-900/70 font-medium">
              Flip the cards and match Indian heritage items with their state, motif or origin!
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-amber-100/80 border border-amber-300 px-4 py-2 rounded-2xl text-center">
              <span className="text-xs font-bold text-amber-900 block">Moves</span>
              <span className="font-cinzel text-xl font-bold text-amber-950">{moves}</span>
            </div>
            <div className="bg-amber-800 text-white px-4 py-2 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">Bonus</span>
              <span className="font-bold text-sm">+30 XP</span>
            </div>
          </div>
        </div>

        {/* 4x3 Grid of Memory Cards matching Screen 9 in mockup */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {cards.map((card) => {
            const isFlipped = flippedCards.some(c => c.instanceId === card.instanceId) || matchedPairs.includes(card.pairId);
            const isMatched = matchedPairs.includes(card.pairId);

            return (
              <div
                key={card.instanceId}
                onClick={() => handleCardClick(card)}
                className="perspective-1000 h-32 sm:h-36 cursor-pointer select-none"
              >
                <div className={`relative w-full h-full rounded-2xl transition-all duration-500 transform-style-3d shadow-xs ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}>
                  
                  {/* Card Backface (Flipped Hidden State with ?) matching Screen 9 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center text-amber-200 backface-hidden shadow-md">
                    <span className="font-cinzel text-3xl font-extrabold">?</span>
                    <span className="text-[10px] uppercase tracking-widest text-amber-300/80 mt-1 font-bold">Heritage</span>
                  </div>

                  {/* Card Frontface (Revealed State) */}
                  <div className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center p-3 text-center rotate-y-180 backface-hidden ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-white border-amber-300 text-amber-950'
                  }`}>
                    <span className="text-3xl mb-1">{card.icon}</span>
                    <span className="font-cinzel text-xs font-bold leading-tight line-clamp-1">{card.title}</span>
                    <span className="text-[10px] text-amber-800 font-medium line-clamp-1 mt-0.5">{card.description}</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Modal / Box */}
        {isCompleted && (
          <div className="bg-amber-100/90 p-8 rounded-2xl border border-amber-300 text-center space-y-4">
            <div className="text-4xl">🏆</div>
            <h3 className="font-cinzel text-2xl font-bold text-amber-950">Board Completed!</h3>
            <p className="text-sm text-amber-900 font-medium">
              You matched all 6 heritage pairs in <span className="font-bold text-amber-950">{moves} moves</span>!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={resetGame}
                className="px-5 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 text-xs font-bold hover:bg-amber-50"
              >
                Play Again
              </button>
              <button
                onClick={() => setCurrentScreen('progress')}
                className="px-6 py-2.5 rounded-xl bg-amber-800 text-white text-xs font-bold hover:bg-amber-900 shadow-xs"
              >
                View My Progress →
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
