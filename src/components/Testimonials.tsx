import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useGym } from '../context/GymContext';

export const Testimonials: React.FC = () => {
  const { testimonials } = useGym();

  return (
    <section id="testimonials" className="py-24 bg-zinc-950 text-white relative overflow-hidden border-t border-zinc-900">
      
      {/* Background circles */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 rounded-full bg-brand/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 rounded-full bg-brand/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-xs uppercase tracking-[0.3em] text-brand mb-2">
            Success Stories
          </h2>
          <p className="font-sans font-black text-4xl sm:text-6xl uppercase text-white tracking-tighter italic">
            WHAT OUR MEMBERS SAY
          </p>
          <div className="w-16 h-1 bg-brand mx-auto mt-4 rounded-sm"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div 
              key={test.id}
              className="bg-zinc-900 border border-zinc-850 rounded-sm p-8 sm:p-10 flex flex-col justify-between relative shadow-xl hover:border-brand hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote Mark */}
              <div className="text-brand opacity-15 absolute top-8 right-8">
                <Quote size={40} className="fill-brand" />
              </div>

              {/* Main Content */}
              <div>
                {/* Stars */}
                <div className="flex items-center space-x-1 text-brand mb-6">
                  {Array.from({ length: typeof test?.rating === 'number' && test.rating > 0 ? test.rating : 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-brand" />
                  ))}
                </div>

                {/* Achievement Badge */}
                <div className="inline-block px-3 py-1 rounded-sm bg-zinc-950 text-brand border border-zinc-800 text-[10px] font-black uppercase tracking-widest mb-4">
                  {test.achievement}
                </div>

                {/* Quote */}
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-zinc-800 pt-6 mt-8">
                <h4 className="font-sans font-black text-white text-base sm:text-lg uppercase tracking-tight italic">
                  {test.name}
                </h4>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-0.5">
                  {test.role}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

