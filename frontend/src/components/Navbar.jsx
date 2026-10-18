import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Search, Menu, X, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { currentScreen, setCurrentScreen, user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'progress', label: 'My Progress' },
    { id: 'favorites', label: 'My Favorites' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#f9f6ef]/95 backdrop-blur-md border-b border-[#e6dccb] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setCurrentScreen('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c86134] to-[#a84323] flex items-center justify-center text-white text-xl shadow-xs group-hover:scale-105 transition-transform duration-300">
              🛕
            </div>
            <div>
              <div className="font-cinzel text-xl font-bold tracking-tight text-[#1a3830]">
                Heritage Storyteller
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = currentScreen === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentScreen(link.id)}
                  className={`relative py-2 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-[#1a3830]'
                      : 'text-[#52645d] hover:text-[#1a3830]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c86134] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Search, Admin, Profile / Login */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Quick Search Button */}
            <button
              onClick={() => setCurrentScreen('explore')}
              className="p-2 rounded-full text-[#1a3830] hover:bg-[#eae0cd]/50 transition-colors"
              title="Search Heritage Topics"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Dashboard shortcut */}
            <button
              onClick={() => setCurrentScreen('admin-dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 border transition-all ${
                currentScreen.startsWith('admin')
                  ? 'bg-[#1a3830] text-amber-100 border-[#1a3830]'
                  : 'bg-amber-50/80 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#c86134]" />
              <span>Admin Panel</span>
            </button>

            {/* XP Badge */}
            <div 
              onClick={() => setCurrentScreen('progress')}
              className="flex items-center space-x-1.5 bg-[#c86134] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs cursor-pointer hover:opacity-95 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-200" />
              <span>{user.xp} XP</span>
            </div>

            {/* Auth / Profile button */}
            {user.isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentScreen('profile')}
                  className="flex items-center space-x-2 bg-[#eae0cd]/60 border border-[#d6c7ae] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1a3830] hover:bg-[#eae0cd] transition-colors"
                >
                  <span className="text-base">{user.avatar}</span>
                  <span className="font-bold">{user.name}</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100 border border-red-200/80 transition-colors"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="px-5 py-2 text-xs font-bold bg-[#1e473b] hover:bg-[#16382e] text-white rounded-full shadow-xs transition-colors"
                >
                  Login
                </button>
              </div>
            )}

          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
              <span>{user.xp} XP</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-amber-900 hover:bg-amber-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#faf8f2] border-b border-[#e6dccb] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentScreen(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold ${
                currentScreen === link.id
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-amber-900 hover:bg-amber-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { setCurrentScreen('admin-dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-lg bg-amber-200/60 font-bold text-amber-950 text-sm flex items-center space-x-2"
            >
              <Shield className="w-4 h-4 text-[#c86134]" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
