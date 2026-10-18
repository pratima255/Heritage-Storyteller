import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Settings, Sparkles, Save, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const { user, setUser, logout, showToast } = useApp();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [language, setLanguage] = useState('English');

  const avatars = ['👩‍🎓', '👨‍🎓', '🤴', '👸', '🎨', '🛕', '🦁'];

  const handleSave = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      avatar
    }));
    showToast('Profile settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-left">
      
      {/* Top Banner matching Screen 12 in mockup */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-md flex items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-xs border border-amber-300">
            {avatar}
          </div>
          <div>
            <h1 className="font-cinzel text-2xl font-bold text-amber-950">{user.name}</h1>
            <p className="text-xs text-amber-900/70 font-medium">Heritage Explorer • Level {user.level}</p>
            <div className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user.xp} XP</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Two Column Layout matching Screen 12 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Menu Sidebar */}
        <div className="md:col-span-4 space-y-2">
          <div className="bg-white p-3 rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-amber-100 font-bold text-xs text-amber-950 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-700" /> Account Info
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-amber-50 font-bold text-xs text-amber-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-700" /> Preferences
            </button>
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 font-bold text-xs text-red-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 text-red-600" /> Logout
            </button>
          </div>
        </div>

        {/* Right Form Fields matching Screen 12 */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-md space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-amber-950 border-b border-amber-100 pb-3">
            Account Information
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-900 uppercase">Choose Avatar</label>
              <div className="flex flex-wrap gap-2">
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                      avatar === av ? 'bg-amber-200 border-amber-600 scale-110 shadow-xs' : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-900 uppercase">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-amber-100 flex justify-between items-center">
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};
