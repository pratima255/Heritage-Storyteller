import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-amber-900 text-amber-100 px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 font-bold text-xs flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
