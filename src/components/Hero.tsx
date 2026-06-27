import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ChevronRight, Play } from 'lucide-react';
import { useGym } from '../context/GymContext';

interface HeroProps {
  onJoinClick: () => void;
  onViewPlansClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick, onViewPlansClick }) => {
  const { settings, hero } = useGym();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi MS Fitness! I am interested in joining your gym. Please share more details.");
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div id="home" className="relative bg-zinc-950 text-white overflow-hidden font-sans">
      
      {/* Top Contact Bar */}
      <div className="bg-brand text-black py-2.5 px-4 sm:px-6 lg:px-8 border-b border-brand-dark/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs sm:text-xs font-black tracking-widest uppercase space-y-2 md:space-y-0">
          {/* Contact Details */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-black">
            <a href={`tel:${settings.phone}`} className="flex items-center space-x-1.5 hover:text-white transition-colors">
              <Phone size={13} className="stroke-[3]" />
              <span>{settings.phone}</span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center space-x-1.5 hover:text-white transition-colors">
              <Mail size={13} className="stroke-[3]" />
              <span>{settings.email}</span>
            </a>
            <div className="hidden sm:flex items-center space-x-1.5 text-black">
              <MapPin size={13} className="stroke-[3]" />
              <span className="truncate max-w-[250px] lg:max-w-none">{settings.address}</span>
            </div>
          </div>
          
          {/* WhatsApp Quick CTA */}
          <div>
            <button 
              onClick={handleWhatsAppClick}
              className="flex items-center space-x-2 bg-black hover:bg-zinc-900 text-white px-3.5 py-1.5 rounded-sm transition-all text-[10px] font-black tracking-widest border border-zinc-800 shadow-md transform hover:scale-[1.03]"
            >
              <MessageCircle size={12} className="text-emerald-400 fill-emerald-400" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Banner */}
      <div className="relative min-h-[calc(100vh-120px)] flex items-center">
        {/* Huge Decorative "GYM" Watermark Background */}
        <div className="absolute top-1/2 left-8 md:left-20 -translate-y-1/2 text-brand opacity-5 font-black text-[120px] sm:text-[220px] lg:text-[320px] leading-none select-none z-0 tracking-tighter italic uppercase">
          {hero.watermark}
        </div>

        {/* Dark Background Overlay Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={hero.image_url || null} 
            alt="MS Fitness Premium Gym Background" 
            className="w-full h-full object-cover opacity-20 object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950/25"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col justify-center w-full">
          <div className="max-w-3xl">
            {/* Visual Accent */}
            <div className="inline-flex items-center space-x-2 bg-brand/10 border border-brand/30 text-brand px-3.5 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              <span>{hero.badge_text}</span>
            </div>

            {/* Headline */}
            <h1 className="font-sans font-black text-6xl sm:text-7xl lg:text-[100px] tracking-tighter text-white mb-8 uppercase leading-[0.85] italic whitespace-pre-line">
              {hero.title}
            </h1>

            {/* Sub-headline */}
            <p className="font-sans text-zinc-400 text-base sm:text-lg lg:text-xl mb-10 leading-relaxed max-w-xl">
              {hero.subtitle}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onJoinClick}
                className="group flex items-center justify-center space-x-2 px-8 py-4 bg-brand hover:bg-white text-black font-black text-base uppercase tracking-widest italic rounded-sm transition-colors duration-200"
              >
                <span>{hero.button_text_1}</span>
                <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onViewPlansClick}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white font-black text-base uppercase tracking-widest italic rounded-sm hover:bg-white hover:text-black transition-colors duration-200"
              >
                <Play size={14} className="fill-current text-current" />
                <span>{hero.button_text_2}</span>
              </button>
            </div>

            {/* Highlights/Badges */}
            <div className="grid grid-cols-3 gap-4 sm:gap-12 mt-16 pt-8 border-t border-zinc-900 max-w-xl">
              <div>
                <div className="font-sans font-black text-3xl sm:text-4xl text-white">{hero.area_stat}</div>
                <div className="font-sans text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Sq. Ft. Area</div>
              </div>
              <div>
                <div className="font-sans font-black text-3xl sm:text-4xl text-brand">{hero.coaches_stat}</div>
                <div className="font-sans text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Elite Coaches</div>
              </div>
              <div>
                <div className="font-sans font-black text-3xl sm:text-4xl text-white">{hero.access_stat}</div>
                <div className="font-sans text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Gym Access</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

