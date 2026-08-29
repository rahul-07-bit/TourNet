import React from 'react';

export default function FAB() {
  return (
    <button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#8E2DE2] to-[#4A00E0] shadow-[0_0_30px_rgba(142,45,226,0.6)] flex items-center justify-center z-[70] hover:scale-110 active:scale-95 transition-all">
      <span className="material-symbols-outlined text-white text-[28px]" data-icon="auto_awesome" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
    </button>
  );
}
