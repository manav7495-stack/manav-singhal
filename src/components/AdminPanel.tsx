import React, { useState, useEffect } from 'react';
import { 
  Lock, LayoutDashboard, UserCheck, Users, Dumbbell, 
  Image, Megaphone, MessageSquare, Settings, LogOut, 
  CheckCircle, XCircle, Plus, Trash2, Edit2, ShieldAlert,
  Save, Eye, Calendar, Mail, Phone, Info, Award, Star, Flame
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { Member, MembershipPlan, Announcement, GalleryPhoto, GymSettings, RequestStatus, PaymentStatus, AttendanceStatus, Gender, AnnouncementType, Trainer, Testimonial, HeroSection, AboutSection } from '../types';

interface AdminPanelProps {
  onLoginSuccess: () => void;
  onLogout: () => void;
  isAdminLoggedIn: boolean;
}

type AdminTab = 'dashboard' | 'requests' | 'members' | 'plans' | 'gallery' | 'announcements' | 'responses' | 'settings' | 'hero' | 'about' | 'testimonials' | 'trainers';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onLoginSuccess, 
  onLogout, 
  isAdminLoggedIn 
}) => {
  const { 
    requests, updateRequestStatus,
    members, addMember, updateMember, deleteMember,
    plans, addPlan, updatePlan, deletePlan,
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
    gallery, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto,
    contactResponses, deleteContactResponse,
    settings, updateSettings,
    trainers, addTrainer, updateTrainer, deleteTrainer,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    hero, updateHero,
    about, updateAbout
  } = useGym();

  // Login Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Modals / Form States
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Specific entity forms
  // Member Form
  const [memberForm, setMemberForm] = useState({
    fullName: '', mobileNumber: '', email: '', age: '', gender: 'Male' as Gender,
    planId: '', fitnessGoal: '', address: '', paymentStatus: 'Unpaid' as PaymentStatus,
    attendanceStatus: 'Absent' as AttendanceStatus, joinedDate: ''
  });

  // Plan Form
  const [planForm, setPlanForm] = useState({
    name: '', price: '', billing: '', featuresString: ''
  });

  // Announcement Form
  const [announcementForm, setAnnouncementForm] = useState({
    title: '', content: '', type: 'Info' as AnnouncementType
  });

  // Gallery Form
  const [galleryForm, setGalleryForm] = useState({
    url: '', title: '', category: ''
  });

  // Settings Form
  const [settingsForm, setSettingsForm] = useState<GymSettings>({ ...settings });

  // Trainers Form
  const [trainerForm, setTrainerForm] = useState({
    name: '', role: '', specialty: '', bio: '', image_url: ''
  });

  // Testimonials Form
  const [testimonialForm, setTestimonialForm] = useState({
    name: '', role: '', achievement: '', quote: '', rating: 5
  });

  // Hero Section Form
  const [heroForm, setHeroForm] = useState<HeroSection>({ ...hero });

  // About Section Form
  const [aboutForm, setAboutForm] = useState<AboutSection>({ ...about });

  // Synchronize form states when database context updates
  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  useEffect(() => {
    setHeroForm({ ...hero });
  }, [hero]);

  useEffect(() => {
    setAboutForm({ ...about });
  }, [about]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'manav20' && passwordInput === '2020') {
      onLoginSuccess();
      setLoginError('');
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid Username or Password! (Try manav20 / 2020)');
    }
  };

  // Helper: Open Member Modal
  const openMemberModal = (type: 'add' | 'edit', m?: Member) => {
    setModalType(type);
    if (type === 'edit' && m) {
      setEditingId(m.id);
      setMemberForm({
        fullName: m.fullName, mobileNumber: m.mobileNumber, email: m.email,
        age: String(m.age), gender: m.gender, planId: m.planId,
        fitnessGoal: m.fitnessGoal, address: m.address, paymentStatus: m.paymentStatus,
        attendanceStatus: m.attendanceStatus, joinedDate: m.joinedDate
      });
    } else {
      setEditingId(null);
      setMemberForm({
        fullName: '', mobileNumber: '', email: '', age: '25', gender: 'Male',
        planId: plans[0]?.id || '', fitnessGoal: '', address: '', 
        paymentStatus: 'Unpaid', attendanceStatus: 'Absent', joinedDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.fullName || !memberForm.mobileNumber || !memberForm.email) {
      alert('Please fill out Name, Phone, and Email');
      return;
    }
    const memberData = {
      fullName: memberForm.fullName,
      mobileNumber: memberForm.mobileNumber,
      email: memberForm.email,
      age: parseInt(memberForm.age) || 25,
      gender: memberForm.gender,
      planId: memberForm.planId,
      fitnessGoal: memberForm.fitnessGoal || 'General Fitness',
      address: memberForm.address || 'Club Area',
      joinedDate: memberForm.joinedDate || new Date().toISOString().split('T')[0],
      paymentStatus: memberForm.paymentStatus,
      attendanceStatus: memberForm.attendanceStatus
    };

    if (modalType === 'edit' && editingId) {
      updateMember({ ...memberData, id: editingId });
    } else {
      addMember(memberData);
    }
    setModalType(null);
  };

  // Helper: Open Plan Modal
  const openPlanModal = (type: 'add' | 'edit', p?: MembershipPlan) => {
    setModalType(type);
    if (type === 'edit' && p) {
      setEditingId(p.id);
      setPlanForm({
        name: p.name, price: p.price, billing: p.billing,
        featuresString: p.features.join('\n')
      });
    } else {
      setEditingId(null);
      setPlanForm({
        name: '', price: '', billing: 'per month', featuresString: ''
      });
    }
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name || !planForm.price) {
      alert('Name and Price are required.');
      return;
    }
    const planData = {
      name: planForm.name,
      price: planForm.price,
      billing: planForm.billing,
      features: planForm.featuresString.split('\n').map(f => f.trim()).filter(Boolean)
    };

    if (modalType === 'edit' && editingId) {
      updatePlan({ ...planData, id: editingId });
    } else {
      addPlan(planData);
    }
    setModalType(null);
  };

  // Helper: Open Announcement Modal
  const openAnnouncementModal = (type: 'add' | 'edit', a?: Announcement) => {
    setModalType(type);
    if (type === 'edit' && a) {
      setEditingId(a.id);
      setAnnouncementForm({
        title: a.title, content: a.content, type: a.type
      });
    } else {
      setEditingId(null);
      setAnnouncementForm({
        title: '', content: '', type: 'Info'
      });
    }
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) {
      alert('Title and Content are required.');
      return;
    }
    const annData = {
      title: announcementForm.title,
      content: announcementForm.content,
      type: announcementForm.type
    };

    if (modalType === 'edit' && editingId) {
      updateAnnouncement({ ...annData, id: editingId, date: new Date().toISOString().split('T')[0] });
    } else {
      addAnnouncement(annData);
    }
    setModalType(null);
  };

  // Helper: Open Gallery Modal
  const openGalleryModal = (type: 'add' | 'edit', g?: GalleryPhoto) => {
    setModalType(type);
    if (type === 'edit' && g) {
      setEditingId(g.id);
      setGalleryForm({
        url: g.url, title: g.title, category: g.category
      });
    } else {
      setEditingId(null);
      setGalleryForm({
        url: '', title: '', category: 'Strength'
      });
    }
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.url || !galleryForm.title) {
      alert('URL and Title are required.');
      return;
    }
    const galData = {
      url: galleryForm.url,
      title: galleryForm.title,
      category: galleryForm.category || 'Strength'
    };

    if (modalType === 'edit' && editingId) {
      updateGalleryPhoto({ ...galData, id: editingId });
    } else {
      addGalleryPhoto(galData);
    }
    setModalType(null);
  };

  // Helper: Open Trainer Modal
  const openTrainerModal = (type: 'add' | 'edit', t?: Trainer) => {
    setModalType(type);
    if (type === 'edit' && t) {
      setEditingId(t.id);
      setTrainerForm({
        name: t.name, role: t.role, specialty: t.specialty, bio: t.bio, image_url: t.image_url
      });
    } else {
      setEditingId(null);
      setTrainerForm({
        name: '', role: '', specialty: '', bio: '', image_url: ''
      });
    }
  };

  const handleTrainerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerForm.name || !trainerForm.role) {
      alert('Name and Role are required.');
      return;
    }
    const trainerData = {
      name: trainerForm.name,
      role: trainerForm.role,
      specialty: trainerForm.specialty,
      bio: trainerForm.bio,
      image_url: trainerForm.image_url
    };

    if (modalType === 'edit' && editingId) {
      updateTrainer({ ...trainerData, id: editingId });
    } else {
      addTrainer(trainerData);
    }
    setModalType(null);
  };

  // Helper: Open Testimonial Modal
  const openTestimonialModal = (type: 'add' | 'edit', t?: Testimonial) => {
    setModalType(type);
    if (type === 'edit' && t) {
      setEditingId(t.id);
      setTestimonialForm({
        name: t.name, role: t.role, achievement: t.achievement, quote: t.quote, rating: t.rating
      });
    } else {
      setEditingId(null);
      setTestimonialForm({
        name: '', role: '', achievement: '', quote: '', rating: t.rating || 5
      });
    }
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.quote) {
      alert('Name and Quote are required.');
      return;
    }
    const testimonialData = {
      name: testimonialForm.name,
      role: testimonialForm.role,
      achievement: testimonialForm.achievement,
      quote: testimonialForm.quote,
      rating: testimonialForm.rating
    };

    if (modalType === 'edit' && editingId) {
      updateTestimonial({ ...testimonialData, id: editingId });
    } else {
      addTestimonial(testimonialData);
    }
    setModalType(null);
  };

  // Handle Hero Submit
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHero(heroForm);
      alert('Hero Section successfully updated & synchronized!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to save Hero Section to database: ' + (err.message || err));
    }
  };

  // Handle About Submit
  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAbout(aboutForm);
      alert('About Section successfully updated & synchronized!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to save About Section to database: ' + (err.message || err));
    }
  };

  // Handle Settings Submit
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settingsForm);
      alert('Gym Settings successfully updated & synchronized!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to save Gym Settings to database: ' + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      
      {/* LOGGED OUT STATE */}
      {!isAdminLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-zinc-950">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-8">
            <div>
              <div className="inline-flex bg-red-600/15 p-4 rounded-full text-red-500 mb-4 border border-red-500/10">
                <Lock size={36} />
              </div>
              <h2 className="font-sans font-black text-2xl uppercase tracking-wider text-white">
                ADMIN <span className="text-red-500">PORTAL</span>
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1.5">
                Authorized entry only. Use temporary admin logins to access settings.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Username</label>
                <input 
                  type="text"
                  value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); setLoginError(''); }}
                  placeholder="e.g. manav20"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Password</label>
                <input 
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(''); }}
                  placeholder="••••"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {loginError && (
                <div className="flex items-center space-x-1.5 text-red-500 text-xs leading-relaxed py-1">
                  <ShieldAlert size={14} className="flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/25 text-xs sm:text-sm hover:scale-[1.01]"
              >
                Access Dashboard
              </button>
            </form>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-xs text-zinc-500 leading-relaxed text-left flex items-start space-x-2">
              <Info size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-zinc-400">Credentials Indicator:</span><br />
                User: <span className="font-mono text-zinc-300">manav20</span> | Pass: <span className="font-mono text-zinc-300">2020</span>
              </div>
            </div>

          </div>
        </div>
      ) : (
        
        /* LOGGED IN VIEW */
        <div className="flex flex-col md:flex-row min-h-screen">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between py-6 flex-shrink-0">
            <div>
              {/* Branding */}
              <div className="px-6 pb-6 border-b border-zinc-800 flex items-center space-x-2">
                <Dumbbell className="text-red-500" size={20} />
                <span className="font-sans font-black text-lg text-white tracking-wider">MS ADMIN</span>
              </div>

              {/* Navigation Items */}
              <nav className="px-3 pt-6 space-y-1 text-sm font-medium">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <LayoutDashboard size={18} />
                  <span>Overview Stats</span>
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'requests' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <div className="flex items-center space-x-3">
                    <UserCheck size={18} />
                    <span>Join Requests</span>
                  </div>
                  {requests.filter(r => r.status === 'Pending').length > 0 && (
                    <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                      {requests.filter(r => r.status === 'Pending').length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('members')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'members' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Users size={18} />
                  <span>Manage Members</span>
                </button>

                <button
                  onClick={() => setActiveTab('plans')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'plans' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Dumbbell size={18} />
                  <span>Membership Plans</span>
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Image size={18} />
                  <span>Gallery Photos</span>
                </button>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'announcements' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Megaphone size={18} />
                  <span>Announcements</span>
                </button>

                <button
                  onClick={() => setActiveTab('responses')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'responses' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare size={18} />
                    <span>Inquiries</span>
                  </div>
                  {contactResponses.length > 0 && (
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {contactResponses.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Settings size={18} />
                  <span>Gym Settings</span>
                </button>

                <button
                  onClick={() => setActiveTab('hero')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'hero' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Eye size={18} />
                  <span>Hero Section</span>
                </button>

                <button
                  onClick={() => setActiveTab('about')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'about' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Award size={18} />
                  <span>About Section</span>
                </button>

                <button
                  onClick={() => setActiveTab('trainers')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'trainers' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Flame size={18} />
                  <span>Manage Trainers</span>
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'testimonials' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  <Star size={18} />
                  <span>Testimonials</span>
                </button>
              </nav>
            </div>

            {/* Logout button */}
            <div className="px-3">
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent hover:border-rose-950/30 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout Admin</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Space */}
          <main className="flex-1 p-6 sm:p-10 max-h-screen overflow-y-auto">
            
            {/* TAB: DASHBOARD / STATS */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Dashboard Overview</h1>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">Real-time telemetry and management metrics of MS Fitness.</p>
                </div>

                {/* Cards stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Active Members</span>
                      <span className="text-3xl font-black text-white">{members.length}</span>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-500 p-3.5 rounded-xl border border-emerald-500/10">
                      <Users size={24} />
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Join Requests</span>
                      <span className="text-3xl font-black text-amber-500">{requests.filter(r => r.status === 'Pending').length} Pending</span>
                    </div>
                    <div className="bg-amber-500/10 text-amber-500 p-3.5 rounded-xl border border-amber-500/10">
                      <UserCheck size={24} />
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Plans</span>
                      <span className="text-3xl font-black text-white">{plans.length} Tiers</span>
                    </div>
                    <div className="bg-red-500/10 text-red-500 p-3.5 rounded-xl border border-red-500/10">
                      <Dumbbell size={24} />
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Contact Inquiries</span>
                      <span className="text-3xl font-black text-white">{contactResponses.length} Responses</span>
                    </div>
                    <div className="bg-blue-500/10 text-blue-500 p-3.5 rounded-xl border border-blue-500/10">
                      <MessageSquare size={24} />
                    </div>
                  </div>

                </div>

                {/* Split list overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Left list: Recent Requests */}
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-sans font-black text-base uppercase text-white">Recent Join Applications</h3>
                      <button onClick={() => setActiveTab('requests')} className="text-xs text-red-500 hover:underline font-bold">View All</button>
                    </div>
                    <div className="space-y-3">
                      {requests.slice(0, 3).map(req => (
                        <div key={req.id} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between text-xs sm:text-sm">
                          <div>
                            <p className="font-bold text-white">{req.fullName}</p>
                            <p className="text-zinc-500 text-xs">{plans.find(p => p.id === req.selectedPlanId)?.name}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right list: Recent Inquiries */}
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-sans font-black text-base uppercase text-white">Recent Feedback Inbox</h3>
                      <button onClick={() => setActiveTab('responses')} className="text-xs text-red-500 hover:underline font-bold">View All</button>
                    </div>
                    <div className="space-y-3">
                      {contactResponses.slice(0, 3).map(res => (
                        <div key={res.id} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1.5 text-xs sm:text-sm">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-white">{res.name}</span>
                            <span className="text-zinc-500">{new Date(res.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-zinc-400 text-xs line-clamp-2 italic">"{res.message}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB: MEMBERSHIP REQUESTS */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Membership Requests</h1>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">Review pending physical registration approvals. Approving instantly issues a member card.</p>
                </div>

                <div className="overflow-x-auto bg-zinc-900 border border-zinc-850 rounded-2xl">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] font-black tracking-wider border-b border-zinc-850">
                      <tr>
                        <th className="p-4 sm:p-5">Applicant</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Requested Plan</th>
                        <th className="p-4">Goal & Message</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {requests.map(req => (
                        <tr key={req.id} className="hover:bg-zinc-950/40 transition-colors">
                          <td className="p-4 sm:p-5">
                            <p className="font-bold text-white">{req.fullName}</p>
                            <p className="text-zinc-500 text-xs">Age: {req.age} | Gender: {req.gender}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-zinc-300 font-mono">{req.mobileNumber}</p>
                            <p className="text-zinc-500 text-xs truncate max-w-[150px]">{req.email}</p>
                          </td>
                          <td className="p-4 font-bold text-red-500">
                            {plans.find(p => p.id === req.selectedPlanId)?.name || 'Unknown Plan'}
                          </td>
                          <td className="p-4 max-w-[200px] sm:max-w-xs">
                            <p className="text-zinc-300 truncate"><span className="text-zinc-500 font-bold">Goal:</span> {req.fitnessGoal}</p>
                            {req.message && <p className="text-zinc-500 text-xs italic truncate mt-0.5">"{req.message}"</p>}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {req.status === 'Pending' && (
                              <div className="inline-flex space-x-2">
                                <button
                                  onClick={() => updateRequestStatus(req.id, 'Approved')}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateRequestStatus(req.id, 'Rejected')}
                                  className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: MEMBERS */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Manage Gym Members</h1>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">Add, update, search, or toggle dues of active physical members.</p>
                  </div>
                  <button
                    onClick={() => openMemberModal('add')}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all shadow-md shadow-red-900/10"
                  >
                    <Plus size={14} />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-zinc-900 border border-zinc-850 rounded-2xl">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] font-black tracking-wider border-b border-zinc-850">
                      <tr>
                        <th className="p-4 sm:p-5">Member Details</th>
                        <th className="p-4">Assigned Plan</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Attendance</th>
                        <th className="p-4 text-center">Joined Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {members.map(mem => (
                        <tr key={mem.id} className="hover:bg-zinc-950/40 transition-colors">
                          <td className="p-4 sm:p-5">
                            <p className="font-bold text-white">{mem.fullName}</p>
                            <p className="text-zinc-500 text-xs">{mem.email} | {mem.mobileNumber}</p>
                          </td>
                          <td className="p-4 font-bold text-zinc-300">
                            {plans.find(p => p.id === mem.planId)?.name || 'Custom / None'}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                const nextPay: PaymentStatus = mem.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid';
                                updateMember({ ...mem, paymentStatus: nextPay });
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors border ${
                                mem.paymentStatus === 'Paid' 
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
                                  : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'
                              }`}
                              title="Click to toggle Payment Status"
                            >
                              {mem.paymentStatus}
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                const nextAttendance: AttendanceStatus = mem.attendanceStatus === 'Present' ? 'Absent' : 'Present';
                                updateMember({ ...mem, attendanceStatus: nextAttendance });
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors border ${
                                mem.attendanceStatus === 'Present' 
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' 
                                  : 'bg-zinc-800 text-zinc-500 border-zinc-750 hover:bg-zinc-750'
                              }`}
                              title="Click to toggle Presence"
                            >
                              {mem.attendanceStatus}
                            </button>
                          </td>
                          <td className="p-4 text-center text-zinc-400 font-mono">{mem.joinedDate}</td>
                          <td className="p-4 text-right">
                            <div className="inline-flex space-x-2">
                              <button
                                onClick={() => openMemberModal('edit', mem)}
                                className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-850"
                                title="Edit Member"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete member: ${mem.fullName}?`)) {
                                    deleteMember(mem.id);
                                  }
                                }}
                                className="p-2 bg-zinc-950 hover:bg-rose-950 hover:text-rose-400 text-zinc-500 rounded border border-zinc-850"
                                title="Delete Member"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: MEMBERSHIP PLANS */}
            {activeTab === 'plans' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Membership Plans</h1>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">Manage, add, or delete active subscription plans.</p>
                  </div>
                  <button
                    onClick={() => openPlanModal('add')}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all"
                  >
                    <Plus size={14} />
                    <span>Create Plan</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.map(p => (
                    <div key={p.id} className="p-6 bg-zinc-900 border border-zinc-850 rounded-2xl flex flex-col justify-between space-y-6">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-sans font-black text-lg uppercase text-white tracking-wide">{p.name}</h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => openPlanModal('edit', p)}
                              className="p-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 rounded"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete plan ${p.name}?`)) deletePlan(p.id);
                              }}
                              className="p-1.5 bg-zinc-950 hover:bg-rose-950 text-zinc-500 hover:text-rose-400 rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="font-sans font-black text-2xl text-red-500 mt-2">
                          {p.price} <span className="text-zinc-500 text-xs font-normal">/ {p.billing}</span>
                        </p>

                        <div className="w-full h-px bg-zinc-800 my-4"></div>

                        <ul className="space-y-2 text-xs text-zinc-400">
                          {p.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center space-x-1.5">
                              <span className="w-1 h-1 rounded-full bg-red-500"></span>
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: GALLERY PHOTOS */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Gallery Photos</h1>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">Add, update, or remove photographic assets using custom URLs.</p>
                  </div>
                  <button
                    onClick={() => openGalleryModal('add')}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all"
                  >
                    <Plus size={14} />
                    <span>Add Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map(photo => (
                    <div key={photo.id} className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden flex flex-col justify-between h-80">
                      <div className="h-44 relative bg-zinc-950">
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded">
                          {photo.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs uppercase text-zinc-400 tracking-wide">Title</h4>
                          <p className="font-bold text-white text-sm truncate">{photo.title}</p>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-850 mt-2">
                          <button
                            onClick={() => openGalleryModal('edit', photo)}
                            className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs rounded font-bold border border-zinc-850"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete this photo?`)) deleteGalleryPhoto(photo.id);
                            }}
                            className="px-2.5 py-1.5 bg-zinc-950 hover:bg-rose-950 text-rose-400 text-xs rounded font-bold border border-zinc-850"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Manage Announcements</h1>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">Create, change, or clear gym banners and public alerts.</p>
                  </div>
                  <button
                    onClick={() => openAnnouncementModal('add')}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all"
                  >
                    <Plus size={14} />
                    <span>Create Alert</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-5 bg-zinc-900 border border-zinc-850 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2.5 text-xs text-zinc-500 font-bold">
                          <Calendar size={13} />
                          <span>{ann.date}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                            ann.type === 'Urgent' ? 'bg-red-600/10 text-red-400' : ann.type === 'Event' ? 'bg-amber-600/10 text-amber-400' : 'bg-blue-600/10 text-blue-400'
                          }`}>
                            {ann.type}
                          </span>
                        </div>
                        <h4 className="font-sans font-black text-base uppercase text-white tracking-wide">{ann.title}</h4>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-3xl">{ann.content}</p>
                      </div>

                      <div className="flex space-x-2 flex-shrink-0 self-end sm:self-start">
                        <button
                          onClick={() => openAnnouncementModal('edit', ann)}
                          className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-850"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete announcement?`)) deleteAnnouncement(ann.id);
                          }}
                          className="p-2 bg-zinc-950 hover:bg-rose-950 hover:text-rose-400 text-zinc-500 rounded border border-zinc-850"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CONTACT RESPONSES */}
            {activeTab === 'responses' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Contact Form Responses</h1>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">Review feedback and queries sent by website visitors.</p>
                </div>

                <div className="space-y-4">
                  {contactResponses.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900 border border-zinc-850 rounded-2xl max-w-md mx-auto">
                      <p className="text-zinc-500 text-sm">Inbox is empty. No inquiries submitted yet.</p>
                    </div>
                  ) : (
                    contactResponses.map(res => (
                      <div key={res.id} className="p-6 bg-zinc-900 border border-zinc-850 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
                          <div>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Sender</span>
                            <h4 className="font-sans font-black text-base text-white uppercase">{res.name}</h4>
                          </div>
                          <div className="text-xs text-zinc-500 font-mono text-left sm:text-right">
                            {new Date(res.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                          <div className="flex items-center space-x-2 text-zinc-300">
                            <Mail size={14} className="text-red-500 flex-shrink-0" />
                            <a href={`mailto:${res.email}`} className="hover:underline">{res.email}</a>
                          </div>
                          <div className="flex items-center space-x-2 text-zinc-300">
                            <Phone size={14} className="text-red-500 flex-shrink-0" />
                            <a href={`tel:${res.phone}`} className="hover:underline">{res.phone}</a>
                          </div>
                        </div>

                        <div className="space-y-1 bg-zinc-950 p-4 rounded-xl border border-zinc-850 text-xs sm:text-sm">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Inquiry Message</span>
                          <p className="text-zinc-200 leading-relaxed italic">
                            "{res.message}"
                          </p>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              if (confirm(`Delete this response record?`)) deleteContactResponse(res.id);
                            }}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg text-xs font-bold border border-rose-500/10 hover:border-rose-600 transition-colors"
                          >
                            <Trash2 size={12} />
                            <span>Delete Inquiry</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Gym Settings</h1>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">Configure gym contact, operational hours, Timings, and Footer copywriting.</p>
                </div>

                <form onSubmit={handleSettingsSubmit} className="p-6 sm:p-8 bg-zinc-900 border border-zinc-850 rounded-2xl space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Support Phone</label>
                      <input 
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Support Email</label>
                      <input 
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Physical Address</label>
                    <input 
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">timings / hours</label>
                      <input 
                        type="text"
                        value={settingsForm.workingHours}
                        onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">WhatsApp Number (For APIs)</label>
                      <input 
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Footer Copywriter Text</label>
                    <textarea 
                      rows={3}
                      value={settingsForm.footerText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-900/10 text-xs sm:text-sm hover:scale-[1.01]"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: HERO SECTION */}
            {activeTab === 'hero' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Hero Section</h1>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">Configure landing banners, slogans, and stats.</p>
                </div>
                <form onSubmit={handleHeroSubmit} className="p-6 sm:p-8 bg-zinc-900 border border-zinc-850 rounded-2xl space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Hero Title</label>
                    <textarea 
                      rows={2}
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Hero Subtitle</label>
                    <textarea 
                      rows={3}
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Background Image URL</label>
                      <input 
                        type="text"
                        value={heroForm.image_url}
                        onChange={(e) => setHeroForm({ ...heroForm, image_url: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Watermark Text</label>
                      <input 
                        type="text"
                        value={heroForm.watermark}
                        onChange={(e) => setHeroForm({ ...heroForm, watermark: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Area Stat</label>
                      <input 
                        type="text"
                        value={heroForm.area_stat}
                        onChange={(e) => setHeroForm({ ...heroForm, area_stat: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Coaches Stat</label>
                      <input 
                        type="text"
                        value={heroForm.coaches_stat}
                        onChange={(e) => setHeroForm({ ...heroForm, coaches_stat: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Access Stat</label>
                      <input 
                        type="text"
                        value={heroForm.access_stat}
                        onChange={(e) => setHeroForm({ ...heroForm, access_stat: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md text-xs sm:text-sm hover:scale-[1.01]"
                    >
                      Save Hero Section
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: ABOUT SECTION */}
            {activeTab === 'about' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">About Section</h1>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">Configure section narrative, core values, and quotes.</p>
                </div>
                <form onSubmit={handleAboutSubmit} className="p-6 sm:p-8 bg-zinc-900 border border-zinc-850 rounded-2xl space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Title Accent</label>
                      <input 
                        type="text"
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Subtitle Header</label>
                      <input 
                        type="text"
                        value={aboutForm.subtitle}
                        onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Description Paragraph 1</label>
                    <textarea 
                      rows={3}
                      value={aboutForm.description_1}
                      onChange={(e) => setAboutForm({ ...aboutForm, description_1: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Description Paragraph 2</label>
                    <textarea 
                      rows={2}
                      value={aboutForm.description_2}
                      onChange={(e) => setAboutForm({ ...aboutForm, description_2: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Intro Banner Image</label>
                      <input 
                        type="text"
                        value={aboutForm.image_url}
                        onChange={(e) => setAboutForm({ ...aboutForm, image_url: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Highlight Quote</label>
                      <input 
                        type="text"
                        value={aboutForm.quote}
                        onChange={(e) => setAboutForm({ ...aboutForm, quote: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-zinc-800 pt-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase text-white tracking-wider">Feature Accreditations</h3>
                    {aboutForm.features?.map((feat, idx) => (
                      <div key={idx} className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Card #{idx + 1} ({feat.icon})</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Feature Slogan" 
                            value={feat.title} 
                            onChange={(e) => {
                              const updatedFeatures = [...aboutForm.features];
                              updatedFeatures[idx] = { ...feat, title: e.target.value };
                              setAboutForm({ ...aboutForm, features: updatedFeatures });
                            }}
                            className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                          />
                          <input 
                            type="text" 
                            placeholder="Feature brief description" 
                            value={feat.desc} 
                            onChange={(e) => {
                              const updatedFeatures = [...aboutForm.features];
                              updatedFeatures[idx] = { ...feat, desc: e.target.value };
                              setAboutForm({ ...aboutForm, features: updatedFeatures });
                            }}
                            className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md text-xs sm:text-sm hover:scale-[1.01]"
                    >
                      Save About Section
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: TRAINERS */}
            {activeTab === 'trainers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Manage Trainers</h1>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">Configure the roster of MS Fitness elite certified personal coaches.</p>
                  </div>
                  <button
                    onClick={() => openTrainerModal('add')}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all"
                  >
                    <Plus size={14} />
                    <span>Add Trainer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trainers.map(tr => (
                    <div key={tr.id} className="p-5 bg-zinc-900 border border-zinc-850 rounded-2xl flex flex-col sm:flex-row gap-5 items-center">
                      <img src={tr.image_url} alt={tr.name} className="w-24 h-24 rounded-full object-cover border-2 border-red-600 flex-shrink-0" />
                      <div className="space-y-2 flex-1 text-center sm:text-left">
                        <div>
                          <h4 className="font-sans font-black text-lg uppercase text-white tracking-wide">{tr.name}</h4>
                          <span className="text-xs text-red-500 font-bold uppercase">{tr.role}</span>
                        </div>
                        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">{tr.bio}</p>
                        <div className="text-[10px] text-zinc-500"><span className="font-bold text-zinc-400">Specialty:</span> {tr.specialty}</div>
                      </div>

                      <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0 self-center">
                        <button
                          onClick={() => openTrainerModal('edit', tr)}
                          className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-850"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete trainer ${tr.name}?`)) deleteTrainer(tr.id);
                          }}
                          className="p-2 bg-zinc-950 hover:bg-rose-950 hover:text-rose-400 text-zinc-500 rounded border border-zinc-850"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white">Member Testimonials</h1>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">Configure and publish verified member physical progression success stories.</p>
                  </div>
                  <button
                    onClick={() => openTestimonialModal('add')}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all"
                  >
                    <Plus size={14} />
                    <span>Add Review</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map(test => (
                    <div key={test.id} className="p-6 bg-zinc-900 border border-zinc-850 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                        <div>
                          <h4 className="font-sans font-black text-base text-white uppercase">{test.name}</h4>
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{test.role}</p>
                        </div>
                        <div className="flex items-center text-red-500 space-x-0.5">
                          {Array.from({ length: test.rating }).map((_, i) => (
                            <Star key={i} size={11} className="fill-red-500" />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="inline-block px-2.5 py-0.5 bg-red-600/10 text-red-400 border border-red-900/20 text-[9px] font-bold uppercase tracking-widest rounded">
                          {test.achievement}
                        </span>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed italic">
                          "{test.quote}"
                        </p>
                      </div>

                      <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-850">
                        <button
                          onClick={() => openTestimonialModal('edit', test)}
                          className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs rounded font-bold border border-zinc-850"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete this testimonial?`)) deleteTestimonial(test.id);
                          }}
                          className="px-2.5 py-1.5 bg-zinc-950 hover:bg-rose-950 text-rose-400 text-xs rounded font-bold border border-zinc-850"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>

          {/* GENERAL DIALOG MODALS OVERLAYS */}
          {/* 1. Member Modal */}
          {modalType && (activeTab === 'members') && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 w-full max-w-xl text-white my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-850 mb-6">
                  <h3 className="font-sans font-black text-xl uppercase tracking-wide">
                    {modalType === 'edit' ? 'Edit Member Details' : 'Add New Gym Member'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleMemberSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Full Name *</label>
                    <input 
                      type="text" required
                      value={memberForm.fullName}
                      onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Mobile *</label>
                      <input 
                        type="text" required
                        value={memberForm.mobileNumber}
                        onChange={(e) => setMemberForm({ ...memberForm, mobileNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Email *</label>
                      <input 
                        type="email" required
                        value={memberForm.email}
                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Age</label>
                      <input 
                        type="number"
                        value={memberForm.age}
                        onChange={(e) => setMemberForm({ ...memberForm, age: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Gender</label>
                      <select 
                        value={memberForm.gender}
                        onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value as Gender })}
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Membership Plan</label>
                      <select 
                        value={memberForm.planId}
                        onChange={(e) => setMemberForm({ ...memberForm, planId: e.target.value })}
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      >
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Fitness Goal</label>
                      <input 
                        type="text"
                        value={memberForm.fitnessGoal}
                        onChange={(e) => setMemberForm({ ...memberForm, fitnessGoal: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Payment Status</label>
                      <select 
                        value={memberForm.paymentStatus}
                        onChange={(e) => setMemberForm({ ...memberForm, paymentStatus: e.target.value as PaymentStatus })}
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Attendance Status</label>
                      <select 
                        value={memberForm.attendanceStatus}
                        onChange={(e) => setMemberForm({ ...memberForm, attendanceStatus: e.target.value as AttendanceStatus })}
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Joined Date</label>
                    <input 
                      type="date"
                      value={memberForm.joinedDate}
                      onChange={(e) => setMemberForm({ ...memberForm, joinedDate: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Address</label>
                    <input 
                      type="text"
                      value={memberForm.address}
                      onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-zinc-850 flex justify-end space-x-2">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded bg-zinc-800 text-xs">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-red-600 rounded text-xs font-bold">Save Details</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 2. Plan Modal */}
          {modalType && (activeTab === 'plans') && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 w-full max-w-md text-white">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-850 mb-6">
                  <h3 className="font-sans font-black text-xl uppercase tracking-wide">
                    {modalType === 'edit' ? 'Edit Membership Plan' : 'Create New Plan'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                <form onSubmit={handlePlanSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Plan Name *</label>
                    <input 
                      type="text" required
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      placeholder="e.g. Premium Yearly Plan"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Price *</label>
                      <input 
                        type="text" required
                        value={planForm.price}
                        onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                        placeholder="e.g. $299"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Billing frequency</label>
                      <input 
                        type="text" required
                        value={planForm.billing}
                        onChange={(e) => setPlanForm({ ...planForm, billing: e.target.value })}
                        placeholder="e.g. per year"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Features (one per line) *</label>
                    <textarea 
                      rows={5} required
                      value={planForm.featuresString}
                      onChange={(e) => setPlanForm({ ...planForm, featuresString: e.target.value })}
                      placeholder="Unlimited 24/7 access&#10;Dedicated trainer support"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-zinc-850 flex justify-end space-x-2">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded bg-zinc-800 text-xs">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-red-600 rounded text-xs font-bold">Save Plan</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 3. Announcement Modal */}
          {modalType && (activeTab === 'announcements') && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 w-full max-w-md text-white">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-850 mb-6">
                  <h3 className="font-sans font-black text-xl uppercase tracking-wide">
                    {modalType === 'edit' ? 'Edit Alert Details' : 'Create New Announcement'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Title *</label>
                    <input 
                      type="text" required
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      placeholder="e.g. Steam Room Repair"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Alert Category</label>
                    <select 
                      value={announcementForm.type}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value as AnnouncementType })}
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    >
                      <option value="Info">Info</option>
                      <option value="Event">Event</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Alert Content *</label>
                    <textarea 
                      rows={5} required
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      placeholder="Write description/notices for gym members..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-zinc-850 flex justify-end space-x-2">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded bg-zinc-800 text-xs">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-red-600 rounded text-xs font-bold">Publish Alert</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 4. Gallery Photo Modal */}
          {modalType && (activeTab === 'gallery') && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 w-full max-w-md text-white">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-850 mb-6">
                  <h3 className="font-sans font-black text-xl uppercase tracking-wide">
                    {modalType === 'edit' ? 'Edit Photo Information' : 'Add Photo to Gallery'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleGallerySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Photo Title *</label>
                    <input 
                      type="text" required
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      placeholder="e.g. Cardio Section"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Image URL *</label>
                    <input 
                      type="url" required
                      value={galleryForm.url}
                      onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Category Category</label>
                    <input 
                      type="text"
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      placeholder="e.g. Strength, Cardio, Group, Personal"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-zinc-850 flex justify-end space-x-2">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded bg-zinc-800 text-xs">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-red-600 rounded text-xs font-bold">Upload Asset</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 5. Trainer Modal */}
          {modalType && (activeTab === 'trainers') && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 w-full max-w-md text-white">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-850 mb-6">
                  <h3 className="font-sans font-black text-xl uppercase tracking-wide">
                    {modalType === 'edit' ? 'Edit Trainer Details' : 'Add New Trainer'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleTrainerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Trainer Name *</label>
                    <input 
                      type="text" required
                      value={trainerForm.name}
                      onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
                      placeholder="e.g. Coach Alex Carter"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Role / Certification *</label>
                    <input 
                      type="text" required
                      value={trainerForm.role}
                      onChange={(e) => setTrainerForm({ ...trainerForm, role: e.target.value })}
                      placeholder="e.g. Master Powerlifting Coach"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Specialties</label>
                      <input 
                        type="text"
                        value={trainerForm.specialty}
                        onChange={(e) => setTrainerForm({ ...trainerForm, specialty: e.target.value })}
                        placeholder="e.g. Strength, Nutrition"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Image URL</label>
                      <input 
                        type="url"
                        value={trainerForm.image_url}
                        onChange={(e) => setTrainerForm({ ...trainerForm, image_url: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Biography / Tagline</label>
                    <textarea 
                      rows={3}
                      value={trainerForm.bio}
                      onChange={(e) => setTrainerForm({ ...trainerForm, bio: e.target.value })}
                      placeholder="e.g. 8+ years coaching champions..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-zinc-850 flex justify-end space-x-2">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded bg-zinc-800 text-xs">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-red-600 rounded text-xs font-bold">Save Trainer</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 6. Testimonial Modal */}
          {modalType && (activeTab === 'testimonials') && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 w-full max-w-md text-white">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-850 mb-6">
                  <h3 className="font-sans font-black text-xl uppercase tracking-wide">
                    {modalType === 'edit' ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Member Name *</label>
                      <input 
                        type="text" required
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        placeholder="Marcus Brody"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Role / Tenure</label>
                      <input 
                        type="text"
                        value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                        placeholder="Member since 2024"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Heroic Achievement</label>
                      <input 
                        type="text"
                        value={testimonialForm.achievement}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, achievement: e.target.value })}
                        placeholder="e.g. Gained 15 lbs muscle"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Rating (1 to 5 Stars)</label>
                      <select 
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Quote Description *</label>
                    <textarea 
                      rows={4} required
                      value={testimonialForm.quote}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                      placeholder="Write review testimonial content..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-zinc-850 flex justify-end space-x-2">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded bg-zinc-800 text-xs">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-red-600 rounded text-xs font-bold">Save Review</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

