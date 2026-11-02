import React, { useState } from 'react';
import { Category } from '../types';
import { useApp } from '../context/AppContext';
import { ArrowRight, ImageOff } from 'lucide-react';

export const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const { setCurrentRoute, setSelectedCategorySlug } = useApp();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    setSelectedCategorySlug(category.slug);
    setCurrentRoute('category');
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:border-rose-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Category Image Area */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-600 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 text-stone-400">
            <ImageOff className="w-10 h-10 mb-2 stroke-1" />
            <span className="text-sm font-serif font-semibold text-stone-700">{category.name}</span>
          </div>
        )}

        {/* Subtle gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Floating title on image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Description & Action */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mb-4 leading-relaxed">
          {category.description}
        </p>

        <div className="flex items-center justify-between text-xs font-semibold text-rose-700 group-hover:text-rose-900 transition-colors pt-2 border-t border-stone-100">
          <span>Explore Collection</span>
          <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
