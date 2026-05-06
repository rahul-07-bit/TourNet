import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-margin py-stack-sm bg-surface/30 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <button className="p-2 hover:bg-white/10 transition-colors rounded-full active:scale-95 duration-150">
        <span className="material-symbols-outlined text-primary" data-icon="search">search</span>
      </button>
      <h1 className="font-headline-lg text-headline-sm tracking-tighter text-primary dark:text-primary-fixed">TOURNET</h1>
      <button className="p-2 hover:bg-white/10 transition-colors rounded-full active:scale-95 duration-150">
        <span className="material-symbols-outlined text-primary" data-icon="notifications">notifications</span>
      </button>
    </header>
  );
}
