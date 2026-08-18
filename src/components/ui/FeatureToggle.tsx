import React from 'react';

interface FeatureToggleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onToggle: () => void;
}

export function FeatureToggle({ title, description, icon, isActive, onToggle }: FeatureToggleProps) {
  return (
    <button 
      role="switch"
      aria-checked={isActive}
      onClick={onToggle}
      className="group flex items-center justify-between w-full p-4 bg-slate-900/80 rounded-2xl border-2 border-slate-800 cursor-pointer hover:border-slate-700 hover:bg-slate-800 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-analysis-blue"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isActive ? 'bg-analysis-blue/20 text-analysis-blue' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'}`}>
          {icon}
        </div>
        <div className="flex flex-col text-left">
          <span className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>{title}</span>
          <span className="text-xs text-slate-500 font-medium">{description}</span>
        </div>
      </div>
      
      {/* Switch Visual */}
      <div className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${isActive ? 'bg-analysis-blue' : 'bg-slate-700'}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </button>
  );
}
