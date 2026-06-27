import React from 'react';
import { Dumbbell, Activity, UserCheck, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgImage: string;
}

const services: ServiceItem[] = [
  {
    id: 'ser-strength',
    title: 'Strength Training',
    description: 'Forge heavy power and premium athletic muscle using our extensive range of free-weights, elite dumbbells up to 150 lbs, and top-tier plate-loaded Hammer Strength machinery.',
    icon: <Dumbbell size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ser-cardio',
    title: 'Cardio & Conditioning',
    description: 'Elevate your heart health and calorie burn in our high-end cardio zone, equipped with smart touch screens, treadmills, assault bikes, rowers, and stairmasters with physical telemetry.',
    icon: <Activity size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ser-personal',
    title: 'Personal Training',
    description: 'Work 1-on-1 with our elite accredited personal coaches. Receive completely customized gym guidance, posture correction, constant motivation, and weekly physical progress tracking.',
    icon: <UserCheck size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ser-loss',
    title: 'Weight Loss Programs',
    description: 'Highly structured fat loss protocols combining metabolic cardio conditioning, progressive strength training, and strict macronutrient guidance to hit your weight target safely.',
    icon: <TrendingDown size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ser-gain',
    title: 'Muscle Hypertrophy',
    description: 'Optimized science-backed protocols targeting dynamic volume, progressive resistance overload, and protein-heavy nutritional guidance for maximum lean muscle tissue gains.',
    icon: <TrendingUp size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ser-group',
    title: 'Zumba & CrossFit',
    description: 'Join our highly energetic group studios! From high-octane explosive Olympic lifts in CrossFit, to upbeat cardio choreography and music-guided workouts in Zumba.',
    icon: <Sparkles size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-zinc-900/50 border-y border-zinc-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-xs uppercase tracking-[0.3em] text-brand mb-2">
            Elite Classes & Gear
          </h2>
          <p className="font-sans font-black text-4xl sm:text-6xl uppercase text-white tracking-tighter italic">
            OUR PREMIUM SERVICES
          </p>
          <div className="w-16 h-1 bg-brand mx-auto mt-4 rounded-sm"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="group relative overflow-hidden rounded-sm border border-zinc-800 bg-[#0a0a0a] p-8 h-[360px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-brand"
            >
              {/* Background image overlay on hover */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={service.bgImage || null} 
                  alt={service.title} 
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-500 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
              </div>

              {/* Icon & Title */}
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-sm bg-zinc-900 border border-zinc-800 text-brand mb-6 group-hover:bg-brand group-hover:text-black group-hover:border-brand transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="font-sans font-black text-xl sm:text-2xl uppercase text-white tracking-tight mb-3 italic">
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <div className="relative z-10 mt-auto">
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-200 transition-colors">
                  {service.description}
                </p>
                <div className="w-0 h-0.5 bg-brand mt-4 group-hover:w-full transition-all duration-500 rounded-sm"></div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
