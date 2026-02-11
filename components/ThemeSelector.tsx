
import React from 'react';
import { Theme } from '../types';

interface ThemeSelectorProps {
  current: Theme;
  onChange: (theme: Theme) => void;
}

const THEMES: { id: Theme; label: string; colors: string }[] = [
  { id: 'minimal', label: 'Minimal', colors: 'bg-white border-gray-200' },
  { id: 'modern', label: 'Modern Dark', colors: 'bg-slate-900 border-slate-700' },
  { id: 'glass', label: 'Glassmorphism', colors: 'bg-indigo-500 border-white/20' },
  { id: 'bold', label: 'High Contrast', colors: 'bg-yellow-400 border-black' },
  { id: 'classic', label: 'Classic Serif', colors: 'bg-stone-100 border-stone-300' },
  { id: 'vibrant', label: 'Vibrant', colors: 'bg-rose-400 border-rose-200' },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ current, onChange }) => {
  return (
    <div className="flex gap-4 overflow-x-auto py-2 px-1">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`
            flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
            ${current === t.id ? 'border-indigo-600 ring-2 ring-indigo-200 ring-offset-2' : 'border-gray-100 hover:border-indigo-200'}
          `}
        >
          <div className={`w-12 h-12 rounded-lg border shadow-inner ${t.colors}`}></div>
          <span className="text-xs font-medium text-gray-600">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
