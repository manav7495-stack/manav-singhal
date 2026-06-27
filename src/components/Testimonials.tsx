import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  achievement: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Marcus Brody',
    role: 'Member since 2024',
    achievement: 'Lost 45 lbs & gained extreme strength',
    quote: "The culture here is electric. It is not just about showing up; the trainers actively correct your forms, the equipment is always pristine, and the community supports your daily grind. Joining MS Fitness completely changed my lifestyle.",
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Natasha Romanoff',
    role: 'Member since 2025',
    achievement: 'Mastered Olympic lifts & core stability',
    quote: "As an active endurance athlete, I needed a gym that had serious equipment and professional coaches. MS Fitness exceeds all metrics. The layout is optimized, the acoustics are great, and the steam room is perfect for post-workout recovery.",
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Rohan Sharma',
    role: 'Member since 2026',
    achievement: 'Gained 15 lbs of pure lean muscle mass',
    quote: "The Yearly Plan is worth every penny! Having a dedicated personal coach and automated macro nutrition plans removed all the guesswork. Highly recommend MS Fitness to anyone looking for premium progression.",
    rating: 5
  }
];

export const Testimonials: React.FC = () => {
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
                  {Array.from({ length: test.rating }).map((_, i) => (
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
