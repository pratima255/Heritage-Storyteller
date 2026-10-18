import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { LogIn, UserPlus, Check } from 'lucide-react';

export const LoginPage = () => {
  const { setCurrentScreen, showToast, refreshUserProgress } = useApp();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !password) {
      setErrorMsg('Please enter both Name and Password.');
      return;
    }

    setLoading(true);

    try {
      const data = await api.login({ name: name.trim(), password });

      if (data.success && data.data?.token) {
        const token = data.data.token;
        const u = data.data.user;

        localStorage.setItem('heritage_auth_token', token);
        localStorage.removeItem('heritage_jwt_token');
        localStorage.removeItem('heritage_token');

        await refreshUserProgress(u);

        showToast(`Welcome back, ${u.name}! Logged in successfully.`);
        setCurrentScreen('explore');
      } else {
        setErrorMsg(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Server error during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !password) {
      setErrorMsg('Please enter both Name and Password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await api.register({
        name: name.trim(),
        password: password,
        confirmPassword: confirmPassword
      });

      if (data.success && data.data?.token) {
        const token = data.data.token;
        const u = data.data.user;

        localStorage.setItem('heritage_auth_token', token);
        localStorage.removeItem('heritage_jwt_token');
        localStorage.removeItem('heritage_token');

        await refreshUserProgress(u);

        showToast(`Registration successful! Welcome, ${u.name}.`);
        setCurrentScreen('explore');
      } else {
        setErrorMsg(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Server error during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-left">
      
      {/* Container split layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl overflow-hidden border border-amber-200/90 shadow-xl">
        
        {/* Left Side Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/20 flex items-center justify-center text-3xl">
              🛕
            </div>
            <h2 className="font-cinzel text-2xl font-extrabold">Heritage Storyteller</h2>
            <p className="text-xs text-amber-200 leading-relaxed">
              Discover India's history, ancient art, monuments, and rich culture through interactive visual stories.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-amber-200">
              <Check className="w-4 h-4 text-amber-400" />
              <span>Save learning progress</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-200">
              <Check className="w-4 h-4 text-amber-400" />
              <span>Earn cultural badges & XP rewards</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-200">
              <Check className="w-4 h-4 text-amber-400" />
              <span>Access interactive heritage mini-games</span>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="md:col-span-7 p-8 space-y-6">
          
          {/* Mode Tabs */}
          <div className="flex border-b border-amber-100 pb-3 gap-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`font-cinzel text-lg font-bold pb-1 transition-all ${
                mode === 'login' ? 'text-amber-950 border-b-2 border-amber-700' : 'text-amber-800/60'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`font-cinzel text-lg font-bold pb-1 transition-all ${
                mode === 'register' ? 'text-amber-950 border-b-2 border-amber-700' : 'text-amber-800/60'
              }`}
            >
              Register
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form: Name & Password */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-900 uppercase">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-900 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Logging in...' : 'Login'}</span>
              </button>

              <div className="pt-2 text-center text-xs text-amber-900">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className="font-bold text-amber-700 underline hover:text-amber-950"
                >
                  Register
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form: Name, Password, Confirm Password */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-900 uppercase">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-900 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-900 uppercase">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Registering...' : 'Register'}</span>
              </button>

              <div className="pt-2 text-center text-xs text-amber-900">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="font-bold text-amber-700 underline hover:text-amber-950"
                >
                  Login
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
