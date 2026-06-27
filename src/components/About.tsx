import React from 'react';
import { Shield, Award, Users, Flame } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-zinc-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-xs uppercase tracking-[0.3em] text-brand mb-2">
            Who We Are
          </h2>
          <p className="font-sans font-black text-4xl sm:text-6xl uppercase text-white tracking-tighter italic">
            ABOUT MS FITNESS
          </p>
          <div className="w-16 h-1 bg-brand mx-auto mt-4 rounded-sm"></div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Side */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1.5 bg-brand opacity-10 group-hover:opacity-20 rounded-sm blur-xs transition duration-700"></div>
            <div className="relative overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800" 
                alt="Trainer coaching member at MS Fitness" 
                className="w-full h-[450px] object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
              
              {/* Overlay Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0a0a0a]/95 border border-zinc-800 rounded-sm p-5">
                <p className="text-brand font-black tracking-widest text-[10px] uppercase mb-1">Elite Standard</p>
                <p className="text-zinc-200 text-sm font-bold italic">"At MS Fitness, we do not just lift weights — we elevate lifestyles, forge mental fortitude, and sculpt champions."</p>
              </div>
            </div>
          </div>

          {/* Description & Features Side */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            <div>
              <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tighter italic text-white mb-4">
                WE ARE THE ULTIMATE TEMPLE OF PHYSICAL PROGRESSION
              </h3>
              <p className="text-zinc-400 leading-relaxed text-base sm:text-lg">
                Founded in MMXXIV, MS Fitness is Fit City's gold-standard athletic temple. We provide a space where high-intensity strength conditioning meets meticulous luxury amenities. From custom Hammer Strength equipment to individualized macro nutrition consulting, we have spared no expense.
              </p>
              <p className="text-zinc-400 leading-relaxed text-base sm:text-lg mt-4">
                Our elite certified strength coaches and nutritional consultants are dedicated to helping you forge your legacy.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="flex items-start space-x-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-900/60 hover:border-brand/40 hover:bg-zinc-900/80 transition-all">
                <div className="bg-brand/10 p-3 rounded-sm text-brand flex-shrink-0">
                  <Shield size={22} />
                </div>
                <div>
                  <h4 className="font-sans font-black text-white text-base uppercase tracking-tight italic">Elite Cleanliness & Safety</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">Medical-grade air filtration and 24/7 dedicated sanitization crew.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-900/60 hover:border-brand/40 hover:bg-zinc-900/80 transition-all">
                <div className="bg-brand/10 p-3 rounded-sm text-brand flex-shrink-0">
                  <Award size={22} />
                </div>
                <div>
                  <h4 className="font-sans font-black text-white text-base uppercase tracking-tight italic">Certified Specialists</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">Every coach holds accredited international athletic certifications.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-900/60 hover:border-brand/40 hover:bg-zinc-900/80 transition-all">
                <div className="bg-brand/10 p-3 rounded-sm text-brand flex-shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <h4 className="font-sans font-black text-white text-base uppercase tracking-tight italic">Immersive Atmosphere</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">Great acoustics, premium spacing, and zero-judgment community.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-900/60 hover:border-brand/40 hover:bg-zinc-900/80 transition-all">
                <div className="bg-brand/10 p-3 rounded-sm text-brand flex-shrink-0">
                  <Flame size={22} />
                </div>
                <div>
                  <h4 className="font-sans font-black text-white text-base uppercase tracking-tight italic">Proven Success Loops</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">Over 5,000+ member physical transformations tracked and verified.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
