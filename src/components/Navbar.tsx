import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { openWhatsAppCTA } from '../utils/whatsapp';

interface NavbarProps {
  currentView?: string;
  setView?: (view: any) => void;
  isAdminLoggedIn?: boolean;
  onAdminLogout?: () => void;
  isUserLoggedIn?: boolean;
  loggedInUserEmail?: string;
  onUserLogout?: () => void;
  onOpenJoinModal?: (planId?: string) => void;
  onOpenUserLoginModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    // Smooth scroll to element
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center cursor-pointer group select-none"
          >
            <img 
              src="/manavdesignlab-logo.png" 
              alt="ManavDesignLab Logo" 
              className="h-[42px] md:h-[55px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-2 lg:space-x-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <button 
              onClick={() => handleNavClick('home')} 
              className="px-3 py-2 rounded-sm hover:text-brand hover:bg-zinc-900 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className="px-3 py-2 rounded-sm hover:text-brand hover:bg-zinc-900 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick('services')} 
              className="px-3 py-2 rounded-sm hover:text-brand hover:bg-zinc-900 transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick('plans')} 
              className="px-3 py-2 rounded-sm hover:text-brand hover:bg-zinc-900 transition-colors"
            >
              Membership Plans
            </button>
            <button 
              onClick={() => handleNavClick('gallery')} 
              className="px-3 py-2 rounded-sm hover:text-brand hover:bg-zinc-900 transition-colors"
            >
              Gallery
            </button>
            <button 
              onClick={() => handleNavClick('announcements')} 
              className="px-3 py-2 rounded-sm hover:text-brand hover:bg-zinc-900 transition-colors"
            >
              Announcements
            </button>
            <button 
              onClick={() => handleNavClick('contact')} 
              className="px-3 py-2 rounded-sm hover:text-brand hover:bg-zinc-900 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => openWhatsAppCTA('Join Now')}
              className="px-6 py-2.5 rounded-sm bg-brand hover:bg-white text-black font-black text-xs tracking-widest transition-all uppercase italic shadow-lg shadow-brand/10 hover:shadow-white/5 duration-200"
            >
              Join Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-sm text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none transition-colors border border-zinc-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-900 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <button 
              onClick={() => handleNavClick('home')} 
              className="text-left px-3 py-2.5 rounded-sm hover:bg-zinc-900 hover:text-brand transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className="text-left px-3 py-2.5 rounded-sm hover:bg-zinc-900 hover:text-brand transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick('services')} 
              className="text-left px-3 py-2.5 rounded-sm hover:bg-zinc-900 hover:text-brand transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick('plans')} 
              className="text-left px-3 py-2.5 rounded-sm hover:bg-zinc-900 hover:text-brand transition-colors"
            >
              Membership Plans
            </button>
            <button 
              onClick={() => handleNavClick('gallery')} 
              className="text-left px-3 py-2.5 rounded-sm hover:bg-zinc-900 hover:text-brand transition-colors"
            >
              Gallery
            </button>
            <button 
              onClick={() => handleNavClick('announcements')} 
              className="text-left px-3 py-2.5 rounded-sm hover:bg-zinc-900 hover:text-brand transition-colors"
            >
              Announcements
            </button>
            <button 
              onClick={() => handleNavClick('contact')} 
              className="text-left px-3 py-2.5 rounded-sm hover:bg-zinc-900 hover:text-brand transition-colors"
            >
              Contact
            </button>
          </div>

          <div className="border-t border-zinc-900 pt-4">
            <button
              onClick={() => { openWhatsAppCTA('Join Now'); setIsOpen(false); }}
              className="w-full py-3 rounded-sm bg-brand hover:bg-white text-black font-black tracking-widest uppercase text-center italic text-sm"
            >
              Join Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
