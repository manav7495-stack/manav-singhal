import React, { useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { MembershipPlans } from './components/MembershipPlans';
import { RequestForm } from './components/RequestForm';
import { Gallery } from './components/Gallery';
import { Announcements } from './components/Announcements';
import { Testimonials } from './components/Testimonials';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { UserPanel } from './components/UserPanel';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { loading } = useGym();
  const [view, setView] = useState<'public' | 'user' | 'admin'>('public');
  
  // Security / Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('ms_admin_logged') === 'true';
  });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    return localStorage.getItem('ms_user_logged') === 'true';
  });

  const [loggedInUserEmail, setLoggedInUserEmail] = useState(() => {
    return localStorage.getItem('ms_user_email') || '';
  });

  // Modals
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [preselectedPlanId, setPreselectedPlanId] = useState<string | undefined>(undefined);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('ms_admin_logged', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('ms_admin_logged');
    setView('public');
  };

  const handleUserLogin = (email: string) => {
    setIsUserLoggedIn(true);
    setLoggedInUserEmail(email);
    localStorage.setItem('ms_user_logged', 'true');
    localStorage.setItem('ms_user_email', email);
  };

  const handleUserLogout = () => {
    setIsUserLoggedIn(false);
    setLoggedInUserEmail('');
    localStorage.removeItem('ms_user_logged');
    localStorage.removeItem('ms_user_email');
    setView('public');
  };

  const handleSelectPlan = (planId: string) => {
    setPreselectedPlanId(planId);
    setIsJoinModalOpen(true);
  };

  const handleOpenJoinNow = () => {
    setPreselectedPlanId(undefined);
    setIsJoinModalOpen(true);
  };

  const handleOpenUserLogin = () => {
    setView('user');
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Luxury Brand Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-center items-center animate-fade-in">
          <div className="relative flex flex-col items-center">
            {/* Spinning gold ring */}
            <div className="w-16 h-16 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            {/* Pulsing Text logo */}
            <span className="mt-6 text-xs font-black uppercase tracking-[0.4em] text-brand animate-pulse">
              MS Fitness
            </span>
            <span className="mt-2 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
              Synchronizing Temple Database...
            </span>
          </div>
        </div>
      )}

      {/* Sticky Top Navbar */}
      <Navbar 
        currentView={view}
        setView={setView}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={handleAdminLogout}
        isUserLoggedIn={isUserLoggedIn}
        loggedInUserEmail={loggedInUserEmail}
        onUserLogout={handleUserLogout}
        onOpenJoinModal={handleOpenJoinNow}
        onOpenUserLoginModal={handleOpenUserLogin}
      />

      {/* Main content rendering */}
      {view === 'public' && (
        <main className="animate-fade-in">
          <Hero 
            onJoinClick={handleOpenJoinNow} 
            onViewPlansClick={() => {
              const el = document.getElementById('plans');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <About />
          <Services />
          <MembershipPlans onSelectPlan={handleSelectPlan} />
          <Gallery />
          <Announcements />
          <Testimonials />
          <ContactForm />
          
          {/* Main Public Footer */}
          <Footer setView={setView} isAdminLoggedIn={isAdminLoggedIn} />
        </main>
      )}

      {view === 'user' && (
        <main className="animate-fade-in">
          <UserPanel 
            onLoginSuccess={handleUserLogin}
            onLogout={handleUserLogout}
            loggedInUserEmail={loggedInUserEmail}
          />
          <Footer setView={setView} isAdminLoggedIn={isAdminLoggedIn} />
        </main>
      )}

      {view === 'admin' && (
        <main className="animate-fade-in">
          <AdminPanel 
            onLoginSuccess={handleAdminLogin}
            onLogout={handleAdminLogout}
            isAdminLoggedIn={isAdminLoggedIn}
          />
          {/* We skip Footer on the full height admin console tab to make it look professional, 
              but we let administrators exit easily via the Sidebar/Navbar */}
        </main>
      )}

      {/* Dynamic Membership Request Modal */}
      <RequestForm 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        preselectedPlanId={preselectedPlanId}
      />

      {/* Floating Interactive WhatsApp CTA */}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  );
}
