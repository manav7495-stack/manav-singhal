import React from 'react';
import { Dumbbell, Lock, ChevronRight, Facebook, Instagram, Shield } from 'lucide-react';
import { useGym } from '../context/GymContext';

interface FooterProps {
  setView: (view: 'public' | 'user' | 'admin') => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ setView, isAdminLoggedIn }) => {
  const { settings } = useGym();

  const handleScroll = (id: string) => {
    setView('public');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <footer className="bg-black text-zinc-400 border-t border-zinc-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div 
              onClick={() => handleScroll('home')} 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="bg-brand p-1.5 rounded-sm text-black flex items-center justify-center font-extrabold">
                <Dumbbell size={18} />
              </div>
              <span className="font-sans font-black text-lg tracking-widest text-white italic">
                MS <span className="text-brand">FITNESS</span>
              </span>
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
              MS Fitness is Fit City's gold standard athletic temple. Forging powerful wills and elite-tier physical performance since MMXXIV.
            </p>
            {/* Social links */}
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href={settings.facebookUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-sm bg-zinc-900 hover:bg-brand hover:text-black text-zinc-400 transition-colors border border-zinc-850"
              >
                <Facebook size={14} className="fill-current" />
              </a>
              <a 
                href={settings.instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-sm bg-zinc-900 hover:bg-brand hover:text-black text-zinc-400 transition-colors border border-zinc-850"
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-sans font-black text-xs uppercase text-white tracking-widest mb-4 italic">Quick Links</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm uppercase tracking-wider font-bold">
              <li>
                <button onClick={() => handleScroll('home')} className="hover:text-brand flex items-center space-x-1 transition-colors">
                  <ChevronRight size={12} />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('about')} className="hover:text-brand flex items-center space-x-1 transition-colors">
                  <ChevronRight size={12} />
                  <span>About Club</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('services')} className="hover:text-brand flex items-center space-x-1 transition-colors">
                  <ChevronRight size={12} />
                  <span>Services</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('plans')} className="hover:text-brand flex items-center space-x-1 transition-colors">
                  <ChevronRight size={12} />
                  <span>Membership Plans</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Gallery & Announcements */}
          <div>
            <h4 className="font-sans font-black text-xs uppercase text-white tracking-widest mb-4 italic">Updates & Space</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm uppercase tracking-wider font-bold">
              <li>
                <button onClick={() => handleScroll('gallery')} className="hover:text-brand flex items-center space-x-1 transition-colors">
                  <ChevronRight size={12} />
                  <span>Photo Gallery</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('announcements')} className="hover:text-brand flex items-center space-x-1 transition-colors">
                  <ChevronRight size={12} />
                  <span>Latest Notices</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('contact')} className="hover:text-brand flex items-center space-x-1 transition-colors">
                  <ChevronRight size={12} />
                  <span>Contact Form</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Portal Operations */}
          <div className="space-y-4">
            <h4 className="font-sans font-black text-xs uppercase text-white tracking-widest mb-4 italic">Portals</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Are you an authorized coordinator? Enter your administrative credentials below to update plans, schedules, and monitor memberships.
            </p>
            <button
              onClick={() => setView('admin')}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-sm text-xs font-black uppercase tracking-widest transition-colors border ${
                isAdminLoggedIn 
                  ? 'bg-brand/10 border-brand/30 text-brand hover:bg-brand hover:text-black'
                  : 'bg-zinc-950 border-zinc-800 hover:border-brand text-zinc-300'
              }`}
            >
              <Lock size={12} />
              <span>{isAdminLoggedIn ? 'Open Admin Dashboard' : 'Admin Login'}</span>
            </button>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-zinc-900 my-8"></div>

        {/* Bottom copyright details */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-600 gap-4">
          <div>
            {settings.footerText}
          </div>
          <div className="flex items-center space-x-1.5 font-semibold text-zinc-500">
            <Shield size={12} />
            <span>Local Secure Session Storage Protected</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
