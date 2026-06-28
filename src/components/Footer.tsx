import React from 'react';
import { Dumbbell, Lock, ChevronRight, Facebook, Instagram, Shield } from 'lucide-react';
import { useGym } from '../context/GymContext';
import logo from '../assets/images/ms-fitness-logo.png';

export const Footer: React.FC = () => {
  const { settings } = useGym();

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-black text-zinc-400 border-t border-zinc-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div 
              onClick={() => handleScroll('home')} 
              className="flex items-center cursor-pointer group"
            >
              <img 
                src={logo} 
                alt="MS Fitness Logo" 
                className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
              MS Fitness is our premium strength and conditioning sanctuary, forging elite physical performance and lifestyle excellence.
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
