import React from 'react';
import { Calendar, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { useGym } from '../context/GymContext';
import { AnnouncementType } from '../types';

export const Announcements: React.FC = () => {
  const { announcements } = useGym();

  const getTypeBadge = (type: AnnouncementType) => {
    switch (type) {
      case 'Urgent':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-brand/15 text-brand border border-brand/30 text-[10px] font-black uppercase tracking-widest rounded-sm">
            <AlertCircle size={11} className="stroke-[3]" />
            <span>Urgent</span>
          </span>
        );
      case 'Event':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-amber-600/15 text-amber-500 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest rounded-sm">
            <Sparkles size={11} className="stroke-[3]" />
            <span>Event</span>
          </span>
        );
      case 'Info':
      default:
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-black uppercase tracking-widest rounded-sm">
            <Calendar size={11} className="stroke-[3]" />
            <span>Info</span>
          </span>
        );
    }
  };

  return (
    <section id="announcements" className="py-24 bg-zinc-900/50 border-y border-zinc-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-xs uppercase tracking-[0.3em] text-brand mb-2">
            Stay Updated
          </h2>
          <p className="font-sans font-black text-4xl sm:text-6xl uppercase text-white tracking-tighter italic">
            GYM ANNOUNCEMENTS
          </p>
          <div className="w-16 h-1 bg-brand mx-auto mt-4 rounded-sm"></div>
        </div>

        {/* List of Announcements */}
        {announcements.length === 0 ? (
          <div className="text-center py-16 bg-zinc-950/40 border border-zinc-800 rounded-sm max-w-xl mx-auto">
            <p className="text-zinc-500 text-sm">No announcements at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {announcements.map((ann) => (
              <div 
                key={ann.id}
                className={`relative p-6 sm:p-8 rounded-sm border bg-[#0a0a0a] transition-all duration-300 hover:border-zinc-700 ${
                  ann.type === 'Urgent' 
                    ? 'border-brand/40 border-l-4 border-l-brand shadow-md shadow-brand/10' 
                    : ann.type === 'Event'
                    ? 'border-zinc-800 border-l-4 border-l-amber-500'
                    : 'border-zinc-800 border-l-4 border-l-zinc-700'
                }`}
              >
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-zinc-500 text-xs sm:text-sm font-bold tracking-widest uppercase">
                    <Calendar size={14} className="text-zinc-600" />
                    <span>{ann.date}</span>
                  </div>
                  <div>
                    {getTypeBadge(ann.type)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tighter italic text-white mb-3">
                  {ann.title}
                </h3>

                {/* Content */}
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  {ann.content}
                </p>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
