import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ArrowRight, BookOpen } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80";

export const FavoritesPage = () => {
  const { favorites, topics, setSelectedTopicId, setCurrentScreen, toggleFavorite } = useApp();

  const favoriteTopics = topics.filter(t => favorites.includes(t.id));

  return (
    <div className="space-y-8 pb-16 text-left">
      
      <div className="space-y-2">
        <h1 className="font-cinzel text-3xl font-extrabold text-amber-950 flex items-center gap-2">
          My Favorites ❤️
        </h1>
        <p className="text-xs sm:text-sm text-amber-900/80 font-medium">
          Quickly access your saved heritage topics and continue learning.
        </p>
      </div>

      {favoriteTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={topic.coverImage || topic.cover_image || DEFAULT_FALLBACK_IMAGE}
                  alt={topic.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                  }}
                />
                <div className="absolute top-3 left-3 bg-amber-950/80 text-amber-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                  {topic.categoryLabel}
                </div>
                <button
                  onClick={() => toggleFavorite(topic.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white text-red-500 shadow-md"
                >
                  <Heart className="w-4 h-4 fill-red-500" />
                </button>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase">📍 {topic.state}</span>
                  <h3 className="font-cinzel text-xl font-bold text-amber-950">{topic.name}</h3>
                  <p className="text-xs text-amber-900/70 line-clamp-2 mt-1">{topic.shortDescription}</p>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-800">5 Chapters</span>
                  <button
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      setCurrentScreen('details');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-amber-200 text-center space-y-4">
          <div className="text-4xl">❤️</div>
          <h3 className="font-cinzel text-xl font-bold text-amber-950">No Favorite Topics Saved Yet</h3>
          <p className="text-xs text-amber-900/70 max-w-md mx-auto">
            Click the heart icon on any heritage topic in the Explorer to save it here for easy access.
          </p>
          <button
            onClick={() => setCurrentScreen('explore')}
            className="px-6 py-2.5 rounded-xl bg-amber-800 text-white text-xs font-bold hover:bg-amber-900"
          >
            Explore Heritage Topics →
          </button>
        </div>
      )}

    </div>
  );
};
