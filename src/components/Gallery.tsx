import React, { useState } from 'react';
import { useGym } from '../context/GymContext';

export const Gallery: React.FC = () => {
  const { gallery } = useGym();
  const [activeFilter, setActiveFilter] = useState('All');

  // Gather unique categories dynamically
  const categories: string[] = ['All', ...Array.from(new Set(gallery.map(g => g.category))) as string[]];

  const filteredPhotos = activeFilter === 'All'
    ? gallery
    : gallery.filter(photo => photo.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="gallery" className="py-24 bg-zinc-950 text-white relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-sans font-black text-xs uppercase tracking-[0.3em] text-brand mb-2">
            Inside The Temple
          </h2>
          <p className="font-sans font-black text-4xl sm:text-6xl uppercase text-white tracking-tighter italic">
            MS FITNESS GALLERY
          </p>
          <div className="w-16 h-1 bg-brand mx-auto mt-4 rounded-sm"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 rounded-sm font-black text-xs uppercase tracking-widest transition-all border ${
                activeFilter.toLowerCase() === category.toLowerCase()
                  ? 'bg-brand border-brand text-black shadow-md shadow-brand/10'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/40 rounded-sm border border-zinc-800">
            <p className="text-zinc-500 text-sm">No photos found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id}
                className="group relative h-80 rounded-sm overflow-hidden border border-zinc-900 bg-zinc-950 flex items-end shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-brand"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={photo.url || null} 
                    alt={photo.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Info Overlay */}
                <div className="relative z-10 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-block px-2.5 py-1 bg-brand text-black text-[9px] font-black uppercase tracking-widest rounded-sm mb-2.5">
                    {photo.category}
                  </span>
                  <h3 className="font-sans font-black text-lg sm:text-xl uppercase text-white tracking-tighter italic">
                    {photo.title}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500 font-bold uppercase tracking-wider">
                    MS Fitness Elite Facility
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
