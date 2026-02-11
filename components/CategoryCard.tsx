
import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  id: Category;
  icon: React.ReactNode;
  description: string;
  selected: boolean;
  color: string;
  bgLight: string;
  onSelect: (id: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, icon, description, selected, color, bgLight, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(id)}
      className={`
        group relative cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all duration-500 ease-out overflow-hidden
        ${selected 
          ? `border-current ${color.replace('text', 'border')} bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] scale-[1.02]` 
          : 'border-white bg-white/60 hover:bg-white hover:border-gray-200 hover:shadow-xl hover:-translate-y-2'}
      `}
    >
      {/* Dynamic Glow Background */}
      <div className={`
        absolute -right-4 -top-4 w-32 h-32 rounded-full transition-all duration-700 blur-3xl opacity-20
        ${selected ? bgLight : 'bg-transparent group-hover:' + bgLight}
      `} />

      <div className={`
        relative mb-8 inline-flex p-5 rounded-[1.5rem] transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6
        ${selected ? `${bgLight} text-white shadow-xl` : `bg-white ${color} shadow-sm border border-gray-100`}
      `}>
        {icon}
      </div>
      
      <div className="relative">
        <h3 className={`text-2xl font-black mb-3 tracking-tighter transition-colors ${selected ? color : 'text-gray-800'}`}>
          {id}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {description}
        </p>
      </div>

      {selected && (
        <div className={`absolute bottom-8 right-8 ${color}`}>
          <div className={`w-10 h-10 rounded-full ${bgLight.replace('500', '100')} flex items-center justify-center`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
