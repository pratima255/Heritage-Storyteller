import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

export const MobilePreviewToggle = ({ isMobileView, setIsMobileView }) => {
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={() => setIsMobileView(!isMobileView)}
        className="px-3.5 py-2 rounded-full bg-amber-900 text-amber-100 font-bold text-xs shadow-xl border border-amber-400 hover:bg-amber-800 transition-all flex items-center space-x-2"
        title="Toggle Screen 21 Mobile View"
      >
        {isMobileView ? (
          <>
            <Monitor className="w-4 h-4 text-amber-300" />
            <span>Desktop View</span>
          </>
        ) : (
          <>
            <Smartphone className="w-4 h-4 text-amber-300" />
            <span>Mobile View</span>
          </>
        )}
      </button>
    </div>
  );
};
