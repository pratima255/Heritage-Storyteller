import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, REGIONS } from '../data/heritageData';
import { Search, Heart, ArrowRight, Filter } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80";

const TOPIC_CATEGORY_MAP = {
  'shivaji-maratha-history': 'history',
  'raigad-hill-forts': 'monuments',
  'lavani-dance': 'dance',
  'warli-art': 'art',
  'tn-brihadeeswarar': 'civilization',
  'bihu-folk-music': 'music',
  'pashmina-weaving': 'crafts',
  'mp-sanchi-stupa': 'culture',
  'mp-khajuraho-festival': 'festivals'
};

const normalizeCategory = (cat) => {
  if (!cat) return '';
  const c = cat.toString().trim().toLowerCase();
  if (c === 'all') return 'all';
  if (c === 'dance') return 'dance';
  if (c === 'music') return 'music';
  if (c === 'traditional art' || c === 'art' || c === 'traditional-art') return 'art';
  if (c === 'crafts' || c === 'craft') return 'crafts';
  if (c === 'monuments' || c === 'monument') return 'monuments';
  if (c === 'festivals' || c === 'festival') return 'festivals';
  if (c === 'history') return 'history';
  if (c === 'civilization') return 'civilization';
  if (c === 'culture') return 'culture';
  return c;
};

const getTopicCategoryKey = (topic) => {
  if (!topic) return '';
  if (topic.id && TOPIC_CATEGORY_MAP[topic.id]) {
    return TOPIC_CATEGORY_MAP[topic.id];
  }
  return normalizeCategory(topic.category) || normalizeCategory(topic.categoryLabel) || '';
};

const getTopicCategoryLabel = (topic, categoryKey) => {
  const catObj = CATEGORIES.find((c) => c.id === categoryKey);
  if (catObj && catObj.id !== 'all') {
    return catObj.name;
  }
  return topic.categoryLabel || topic.category || 'Heritage';
};

const STATE_REGION_MAP = {
  'maharashtra': 'West India',
  'tamil nadu': 'South India',
  'assam': 'East India',
  'jammu & kashmir': 'North India',
  'jammu and kashmir': 'North India',
  'madhya pradesh': 'Central India'
};

const REGION_STATE_MAP = {
  'west india': ['maharashtra'],
  'south india': ['tamil nadu'],
  'east india': ['assam'],
  'north india': ['jammu & kashmir', 'jammu and kashmir'],
  'central india': ['madhya pradesh']
};

const matchesLocation = (topic, filterVal) => {
  if (!filterVal) return true;
  const f = filterVal.trim().toLowerCase();
  if (f === 'all' || f === 'all regions' || f === 'all states' || f === 'all states & regions') {
    return true;
  }

  const topicState = (topic.state || '').trim().toLowerCase();
  const topicRegion = (topic.region || STATE_REGION_MAP[topicState] || '').trim().toLowerCase();

  // 1. Direct equality with state or region
  if (topicState === f || topicRegion === f) {
    return true;
  }

  // 2. If filter is a region name, check if topic's state belongs to that region
  if (REGION_STATE_MAP[f] && REGION_STATE_MAP[f].includes(topicState)) {
    return true;
  }

  // 3. If filter is a state name, check if topic's region maps to this state
  if (STATE_REGION_MAP[f] && STATE_REGION_MAP[f].toLowerCase() === topicRegion) {
    return true;
  }

  // 4. Substring / partial match
  if (topicState.includes(f) || topicRegion.includes(f)) {
    return true;
  }

  return false;
};

export const ExplorerPage = () => {
  const { topics, setSelectedTopicId, setCurrentScreen, favorites, toggleFavorite } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  const filteredTopics = topics.filter((topic) => {
    const query = searchQuery.trim().toLowerCase();
    const topicState = (topic.state || '').toLowerCase();
    const topicRegion = (topic.region || STATE_REGION_MAP[topicState] || '').toLowerCase();
    const matchesSearch = !query ||
                          (topic.name && topic.name.toLowerCase().includes(query)) ||
                          topicState.includes(query) ||
                          topicRegion.includes(query) ||
                          (topic.description && topic.description.toLowerCase().includes(query)) ||
                          (topic.shortDescription && topic.shortDescription.toLowerCase().includes(query));
    
    const topicCategoryKey = getTopicCategoryKey(topic);
    const matchesCategory = selectedCategory === 'all' || topicCategoryKey === normalizeCategory(selectedCategory);
    const matchesRegion = matchesLocation(topic, selectedRegion);

    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="space-y-8 pb-16 text-left">
      
      {/* Header section */}
      <div className="space-y-2">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-950">
          Explore Indian Heritage
        </h1>
        <p className="text-sm text-amber-900/80 font-medium">
          Discover monuments, art forms, traditions, and legendary historical figures.
        </p>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-5">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-amber-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search heritage, state, monument..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-sm font-medium placeholder-amber-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Category Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-900 uppercase tracking-wider">Filter by Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    active
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/70 border border-amber-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Region Filter Dropdown */}
        <div className="flex items-center space-x-3 pt-2 border-t border-amber-100">
          <Filter className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-bold text-amber-900 uppercase">Filter by State / Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="All Regions">All States & Regions</option>
            <optgroup label="Regions">
              <option value="Central India">Central India</option>
              <option value="East India">East India</option>
              <option value="North India">North India</option>
              <option value="South India">South India</option>
              <option value="West India">West India</option>
            </optgroup>
            <optgroup label="States">
              <option value="Assam">Assam</option>
              <option value="Jammu & Kashmir">Jammu & Kashmir</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </optgroup>
          </select>

          <span className="text-xs text-amber-800 font-medium ml-auto">
            Topics Found: {filteredTopics.length}
          </span>
        </div>

      </div>

      {/* Topics Cards Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const isFav = favorites.includes(topic.id);
            const topicCategoryKey = getTopicCategoryKey(topic);
            const topicCategoryLabel = getTopicCategoryLabel(topic, topicCategoryKey);
            return (
              <div
                key={topic.id}
                className="bg-[#faf8f2] rounded-3xl overflow-hidden border border-[#e6dccb] hover:border-[#c86134] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={topic.cover_image || topic.coverImage || DEFAULT_FALLBACK_IMAGE}
                      alt={topic.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-[#1a3830]/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {topic.state}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(topic.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-amber-900 transition-colors shadow-xs"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-xs font-extrabold text-[#c86134] uppercase tracking-wider">
                      {topicCategoryLabel}
                    </div>
                    <h3 className="font-cinzel text-lg font-bold text-[#1a3830] group-hover:text-[#c86134] transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-[#52645d] leading-relaxed line-clamp-2 font-medium">
                      {topic.description || topic.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-[#f0e8d8] mt-3">
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                    {topic.chapters?.length || 5} Chapters
                  </span>

                  <button
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      setCurrentScreen('details');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1e473b] hover:bg-[#16382e] text-white text-xs font-bold transition-colors flex items-center space-x-1"
                  >
                    <span>Start Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-amber-200/80 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="font-cinzel text-xl font-bold text-amber-950">No heritage topics found</h3>
          <p className="text-xs text-amber-900/70">Try adjusting your search query, category, or region filters.</p>
        </div>
      )}

    </div>
  );
};
