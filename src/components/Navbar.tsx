import React, { useState } from 'react';
import { Menu, X, Dumbbell, User, Lock, LogOut } from 'lucide-react';
import { useGym } from '../context/GymContext';

interface NavbarProps {
  currentView: 'public' | 'user' | 'admin';
  setView: (view: 'public' | 'user' | 'admin') => void;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
  isUserLoggedIn: boolean;
  loggedInUserEmail: string;
  onUserLogout: () => void;
  onOpenJoinModal: (planId?: string) => void;
  onOpenUserLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  isAdminLoggedIn,
  onAdminLogout,
  isUserLoggedIn,
  loggedInUserEmail,
  onUserLogout,
  onOpenJoinModal,
  onOpenUserLoginModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useGym();

  const handleNavClick = (sectionId: string) => {
    setView('public');
    setIsOpen(false);
    // Smooth scroll to element
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setView('public')} 
            className="flex items-center space-x-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 bg-brand rounded-sm flex items-center justify-center font-black italic text-black text-base tracking-tighter transition-transform group-hover:scale-105">
              MS
            </div>
            <span className="font-sans font-black text-2xl tracking-tighter uppercase text-white">
              FITNESS
            </span>
          </div>

          {/* Desktop Navigation Links */}
          {currentView === 'public' && (
            <div className="hidden md:flex space-x-1 lg:space-x-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
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
                Plans
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
          )}

          {currentView !== 'public' && (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setView('public')}
                className="text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                ← Back to Main Website
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* User Panel Button */}
            {isUserLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('user')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest transition-all border border-zinc-800"
                >
                  <User size={14} className="text-brand" />
                  <span>Member Panel</span>
                </button>
                <button
                  onClick={onUserLogout}
                  title="Logout"
                  className="p-2 rounded-sm bg-zinc-900 hover:bg-brand/20 hover:text-brand text-zinc-400 transition-all border border-zinc-800"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenUserLoginModal}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest transition-all border border-zinc-800"
              >
                <User size={14} />
                <span>Member Login</span>
              </button>
            )}

            {/* Admin Panel Button */}
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('admin')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-brand hover:bg-brand-dark text-black font-black text-xs uppercase tracking-widest transition-all shadow-md"
                >
                  <Lock size={14} />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  title="Logout Admin"
                  className="p-2 rounded-sm bg-zinc-900 hover:bg-brand/20 hover:text-brand text-zinc-400 transition-all border border-zinc-800"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView('admin')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-zinc-900 hover:bg-brand/10 hover:text-brand text-zinc-400 font-bold text-xs uppercase tracking-widest transition-all border border-zinc-800"
              >
                <Lock size={13} />
                <span>Admin Login</span>
              </button>
            )}

            {currentView === 'public' && (
              <button
                onClick={() => onOpenJoinModal()}
                className="px-5 py-2 rounded-sm bg-brand hover:bg-white text-black hover:text-black font-black text-xs tracking-widest transition-all uppercase italic"
              >
                Join Now
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isUserLoggedIn && (
              <button
                onClick={() => setView('user')}
                className="p-2 rounded-sm bg-zinc-900 text-brand border border-zinc-800"
                title="Member Panel"
              >
                <User size={18} />
              </button>
            )}
            {isAdminLoggedIn && (
              <button
                onClick={() => setView('admin')}
                className="p-2 rounded-sm bg-brand text-black"
                title="Admin Panel"
              >
                <Lock size={18} />
              </button>
            )}
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
          {currentView === 'public' ? (
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
                Plans
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
          ) : (
            <button
              onClick={() => { setView('public'); setIsOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              ← Back to Main Website
            </button>
          )}

          <div className="border-t border-zinc-900 pt-4 flex flex-col space-y-2.5">
            {isUserLoggedIn ? (
              <div className="flex items-center justify-between px-3">
                <button
                  onClick={() => { setView('user'); setIsOpen(false); }}
                  className="flex items-center space-x-2 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-widest"
                >
                  <User size={16} className="text-brand" />
                  <span>My Member Portal</span>
                </button>
                <button
                  onClick={() => { onUserLogout(); setIsOpen(false); }}
                  className="text-xs text-brand hover:underline font-bold uppercase tracking-widest"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenUserLoginModal(); setIsOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-sm bg-zinc-900 text-zinc-200 border border-zinc-800 text-xs font-bold uppercase tracking-widest"
              >
                <User size={16} />
                <span>Member Login</span>
              </button>
            )}

            {isAdminLoggedIn ? (
              <div className="flex items-center justify-between px-3 pt-1">
                <button
                  onClick={() => { setView('admin'); setIsOpen(false); }}
                  className="flex items-center space-x-2 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-widest"
                >
                  <Lock size={16} className="text-brand" />
                  <span>Admin Dashboard</span>
                </button>
                <button
                  onClick={() => { onAdminLogout(); setIsOpen(false); }}
                  className="text-xs text-brand hover:underline font-bold uppercase tracking-widest"
                >
                  Logout Admin
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setView('admin'); setIsOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-sm bg-zinc-900 text-zinc-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest"
              >
                <Lock size={14} />
                <span>Admin Portal Login</span>
              </button>
            )}

            {currentView === 'public' && (
              <button
                onClick={() => { onOpenJoinModal(); setIsOpen(false); }}
                className="w-full py-3 rounded-sm bg-brand hover:bg-white text-black font-black tracking-widest uppercase text-center italic text-sm"
              >
                Join Now
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
