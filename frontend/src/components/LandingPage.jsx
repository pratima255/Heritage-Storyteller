import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, BookOpen, HelpCircle, Gamepad2, Award, ArrowRight, Heart, Search, Headphones, CheckSquare, Lightbulb, Trophy } from 'lucide-react';
import heroBg from '../assets/hero-bg.jpg';
import bottomLandscape from '../assets/bottom-landscape.jpg';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80";

export const LandingPage = () => {
  const { setCurrentScreen, setSelectedTopicId, topics, favorites, toggleFavorite } = useApp();

  const journeySteps = [
    { num: 1, label: 'Discover', desc: 'Explore heritage topics', icon: <Search className="w-6 h-6 text-[#2b4c27]" />, bg: 'bg-[#8fae85]/30 border border-[#7a9d70]', action: () => setCurrentScreen('explore') },
    { num: 2, label: 'Listen', desc: 'Enjoy the story with narration', icon: <Headphones className="w-6 h-6 text-[#9b4a2d]" />, bg: 'bg-[#f4b89e]/30 border border-[#e59b7b]', action: () => { setSelectedTopicId('warli-art'); setCurrentScreen('story'); } },
    { num: 3, label: 'Learn', desc: 'Absorb fascinating details', icon: <Lightbulb className="w-6 h-6 text-[#682e82]" />, bg: 'bg-[#cbabda]/30 border border-[#b28ac4]', action: () => { setSelectedTopicId('warli-art'); setCurrentScreen('story'); } },
    { num: 4, label: 'Quiz', desc: 'Test your knowledge', icon: <HelpCircle className="w-6 h-6 text-[#9e3a62]" />, bg: 'bg-[#f7afc6]/30 border border-[#e282a5]', action: () => { setSelectedTopicId('warli-art'); setCurrentScreen('quiz'); } },
    { num: 5, label: 'Play', desc: 'Try fun mini-games', icon: <Gamepad2 className="w-6 h-6 text-[#185e5c]" />, bg: 'bg-[#99d8d6]/30 border border-[#6bbfbd]', action: () => setCurrentScreen('artifact-match') },
    { num: 6, label: 'Remember', desc: 'Earn XP, badges & track progress', icon: <Trophy className="w-6 h-6 text-[#805f0a]" />, bg: 'bg-[#fce08b]/40 border border-[#e2be52]', action: () => setCurrentScreen('progress') }
  ];

  const features = [
    {
      title: 'Visual Stories',
      desc: 'Short, engaging chapters with images and narration.',
      icon: <BookOpen className="w-7 h-7 text-[#2b4c27]" />,
      iconBg: 'bg-[#8fae85]/20 border-[#7a9d70]',
      action: () => setCurrentScreen('explore')
    },
    {
      title: 'Audio Narration',
      desc: 'Listen and learn in your preferred language.',
      icon: <Headphones className="w-7 h-7 text-[#9b4a2d]" />,
      iconBg: 'bg-[#f4b89e]/30 border-[#e59b7b]',
      action: () => { setSelectedTopicId('warli-art'); setCurrentScreen('story'); }
    },
    {
      title: 'Quizzes',
      desc: 'Test your knowledge and earn XP.',
      icon: <CheckSquare className="w-7 h-7 text-[#682e82]" />,
      iconBg: 'bg-[#cbabda]/30 border-[#b28ac4]',
      action: () => { setSelectedTopicId('warli-art'); setCurrentScreen('quiz'); }
    },
    {
      title: 'Mini-Games',
      desc: 'Match artifacts, play memory games and have fun!',
      icon: <Gamepad2 className="w-7 h-7 text-[#805f0a]" />,
      iconBg: 'bg-[#fce08b]/40 border-[#e2be52]',
      action: () => setCurrentScreen('artifact-match')
    },
    {
      title: 'Achievements',
      desc: 'Earn badges, level up and track your progress.',
      icon: <Award className="w-7 h-7 text-[#185e5c]" />,
      iconBg: 'bg-[#99d8d6]/30 border-[#6bbfbd]',
      action: () => setCurrentScreen('achievements')
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner Section */}
      <section 
        className="relative overflow-hidden -mt-6 bg-[#f8f4ea] rounded-3xl border border-[#e6dccb] p-8 lg:p-12 shadow-xs min-h-[460px] flex items-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: 'right bottom',
          backgroundSize: 'contain'
        }}
      >
        <div className="max-w-xl space-y-6 text-left relative z-10 py-4">
          <div className="inline-flex items-center space-x-2 bg-amber-100/90 text-[#a84323] px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 fill-[#c86134]" />
            <span>✨ Interactive Indian Cultural Learning</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a3e35] leading-[1.15] tracking-tight">
            Discover, Listen, Learn & Play India's Rich Heritage
          </h1>

          <p className="text-sm sm:text-base text-[#3a544c] leading-relaxed font-medium max-w-md">
            Embark on visual story journeys through ancient art, timeless monuments, folk dances, and sacred traditions.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setCurrentScreen('explore')}
              className="px-7 py-3.5 rounded-full bg-[#1e473b] hover:bg-[#16382e] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2.5 group"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => { setSelectedTopicId('warli-art'); setCurrentScreen('story'); }}
              className="px-6 py-3.5 rounded-full bg-amber-100 hover:bg-amber-200 text-[#1a3e35] border border-amber-300 font-bold text-sm shadow-xs transition-colors"
            >
              Listen Audio Stories
            </button>
          </div>
        </div>
      </section>

      {/* 5 Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              onClick={feat.action}
              className="bg-[#faf8f2] rounded-2xl p-5 border border-[#e6dccb] hover:border-[#c86134] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer space-y-3 text-left group"
            >
              <div className={`w-12 h-12 rounded-xl border ${feat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {feat.icon}
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#1a3830]">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#52645d] leading-relaxed font-medium mt-1">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Learning Pathway (6 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        <div className="flex items-center justify-between border-b border-[#e6dccb] pb-4">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-[#1a3830]">
              The Heritage Learning Journey
            </h2>
            <p className="text-xs text-[#52645d] font-medium">
              Discover → Listen → Learn → Quiz → Play → Remember
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {journeySteps.map((step) => (
            <div
              key={step.num}
              onClick={step.action}
              className={`p-4 rounded-2xl ${step.bg} shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 text-left group`}
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-white/80 font-bold text-xs flex items-center justify-center text-amber-950">
                  {step.num}
                </span>
                <div className="group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>
              <div>
                <div className="font-bold text-sm text-amber-950">{step.label}</div>
                <div className="text-[11px] text-amber-900/80 leading-tight font-medium mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Heritage Topics Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        <div className="flex items-center justify-between border-b border-[#e6dccb] pb-4">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-[#1a3830]">
              Featured Heritage Journeys
            </h2>
            <p className="text-xs text-[#52645d] font-medium">
              Step into India's legendary stories, monuments, and traditional art forms.
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('explore')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#c86134] hover:bg-amber-100/60 transition-colors flex items-center space-x-1"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.slice(0, 6).map((topic) => {
            const isFav = favorites.includes(topic.id);
            return (
              <div
                key={topic.id}
                className="bg-[#faf8f2] rounded-3xl overflow-hidden border border-[#e6dccb] hover:border-[#c86134] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
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
                      {topic.category}
                    </div>
                    <h3 className="font-cinzel text-lg font-bold text-[#1a3830] group-hover:text-[#c86134] transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-[#52645d] leading-relaxed line-clamp-2 font-medium">
                      {topic.description}
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
                    className="px-4 py-2 rounded-xl bg-[#1e473b] hover:bg-[#16382e] text-white text-xs font-bold transition-colors"
                  >
                    Start Reading
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Decorative Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden shadow-sm border border-[#e6dccb] relative h-40 sm:h-52">
          <img
            src={bottomLandscape}
            alt="Heritage Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/80 via-amber-950/40 to-transparent flex items-center px-8 text-left text-white">
            <div className="max-w-md space-y-2">
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold">
                Preserving India's Cultural Legacy
              </h3>
              <p className="text-xs text-amber-200 leading-relaxed font-medium">
                Designed for students, heritage lovers, and inquisitive minds to explore ancient traditions interactively.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
