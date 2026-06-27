import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Dumbbell, 
  MapPin, Clock, CreditCard, CheckCircle2, XCircle, 
  Sparkles, Megaphone, LogOut, ArrowRight, ArrowLeft, MessageSquare 
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { Member } from '../types';

interface UserPanelProps {
  onLoginSuccess: (email: string) => void;
  onLogout: () => void;
  loggedInUserEmail: string;
}

export const UserPanel: React.FC<UserPanelProps> = ({ 
  onLoginSuccess, 
  onLogout, 
  loggedInUserEmail 
}) => {
  const { members, plans, announcements, settings, updateMember } = useGym();
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Find the active member profile
  const member = members.find(m => m.email.toLowerCase() === loggedInUserEmail.toLowerCase());
  const memberPlan = member ? plans.find(p => p.id === member.planId) : null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = loginInput.trim().toLowerCase();
    
    if (!cleanInput) {
      setLoginError('Please enter your email address or mobile number');
      return;
    }

    // Lookup member
    const foundMember = members.find(m => 
      m.email.toLowerCase() === cleanInput || 
      m.mobileNumber.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '')
    );

    if (foundMember) {
      onLoginSuccess(foundMember.email);
      setLoginError('');
      setLoginInput('');
    } else {
      setLoginError('No active member found with that Email or Mobile number. Try "john.smith@hotmail.com" or "sarah.connor@apocalypse.net".');
    }
  };

  // Quick select login for ease of testing
  const handleQuickLogin = (email: string) => {
    onLoginSuccess(email);
    setLoginError('');
  };

  const handleToggleAttendance = () => {
    if (!member) return;
    const updated: Member = {
      ...member,
      attendanceStatus: member.attendanceStatus === 'Present' ? 'Absent' : 'Present'
    };
    updateMember(updated);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi MS Fitness! I am a member. I have a query regarding my membership plan.");
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* LOGGED OUT STATE */}
        {!member ? (
          <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
            <div className="inline-flex bg-red-600/15 p-4 rounded-full text-red-500 mb-6 border border-red-500/10">
              <User size={36} />
            </div>
            
            <h2 className="font-sans font-black text-2xl uppercase tracking-wider text-white">
              MEMBER <span className="text-red-500">PORTAL</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-2 mb-8 leading-relaxed">
              Access your MS Fitness member dashboard to review plan details, check payment statuses, and mark attendance.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Email or Mobile Number
                </label>
                <input 
                  type="text"
                  value={loginInput}
                  onChange={(e) => { setLoginInput(e.target.value); setLoginError(''); }}
                  placeholder="e.g. john.smith@hotmail.com"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {loginError && (
                <p className="text-red-500 text-xs leading-relaxed">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/25 text-xs sm:text-sm flex items-center justify-center space-x-1.5 hover:scale-[1.01]"
              >
                <span>Login Securely</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Quick Demo Assist */}
            <div className="border-t border-zinc-800 pt-6 mt-8">
              <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                Quick Demo Accounts (Click to test)
              </span>
              <div className="flex flex-col gap-2">
                {members.slice(0, 3).map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleQuickLogin(m.email)}
                    className="flex justify-between items-center px-4 py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 rounded-xl text-xs text-zinc-300 transition-colors"
                  >
                    <span>{m.fullName} ({m.attendanceStatus})</span>
                    <span className="text-red-400 hover:underline">Select →</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          
          /* LOGGED IN MEMBER VIEW */
          <div className="space-y-8">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-zinc-900 border border-zinc-850 p-6 sm:p-8 rounded-3xl gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600/10 p-4 rounded-2xl text-red-500 border border-red-500/20">
                  <Dumbbell size={32} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-red-600 text-white font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                      Active Member
                    </span>
                  </div>
                  <h1 className="font-sans font-black text-2xl sm:text-3xl uppercase text-white mt-1">
                    {member.fullName}
                  </h1>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Member ID: <span className="font-mono text-zinc-300">{member.id}</span> | Joined: {member.joinedDate}
                  </p>
                </div>
              </div>
              
              {/* Logout button */}
              <div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-bold border border-zinc-800"
                >
                  <LogOut size={14} />
                  <span>Logout Member Portal</span>
                </button>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Metrics & Controls */}
              <div className="md:col-span-8 space-y-8">
                
                {/* Membership & Payment block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Plan Information */}
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-850 flex flex-col justify-between h-48">
                    <div>
                      <div className="flex items-center space-x-1.5 text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
                        <CreditCard size={14} />
                        <span>My Membership</span>
                      </div>
                      <h3 className="font-sans font-black text-xl uppercase tracking-tight text-white leading-tight">
                        {memberPlan ? memberPlan.name : 'Unknown Plan'}
                      </h3>
                      <p className="text-red-500 font-extrabold text-sm mt-1">
                        {memberPlan ? memberPlan.price : ''} <span className="text-zinc-500 font-normal">/ {memberPlan?.billing}</span>
                      </p>
                    </div>
                    
                    <div className="text-xs text-zinc-400 line-clamp-2 pt-4 border-t border-zinc-850">
                      {memberPlan?.features.slice(0, 2).join(', ')}...
                    </div>
                  </div>

                  {/* Payment Status & Action */}
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-850 flex flex-col justify-between h-48">
                    <div>
                      <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Payment Status</span>
                      
                      {member.paymentStatus === 'Paid' ? (
                        <div className="inline-flex items-center space-x-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
                          <CheckCircle2 size={14} />
                          <span>Paid & Good Standing</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-2 text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
                          <XCircle size={14} />
                          <span>Payment Due</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-zinc-850">
                      {member.paymentStatus === 'Paid' ? (
                        <p className="text-zinc-500 text-[11px] leading-snug">
                          Your membership account is fully funded. Thank you for your continued physical dedication!
                        </p>
                      ) : (
                        <p className="text-rose-400/90 text-[11px] leading-snug font-bold">
                          Please visit the reception counter to update your card details or pay dues.
                        </p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Interactive Attendance Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-850 space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-red-500 block mb-1">Interactive Log</span>
                    <h3 className="font-sans font-black text-lg sm:text-xl uppercase text-white">Daily Gym Attendance</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                      Mark yourself present when you enter the physical turnstile, or toggle back when finished.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl bg-zinc-950 border border-zinc-850 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${member.attendanceStatus === 'Present' ? 'bg-emerald-500 shadow-md shadow-emerald-500/40 animate-pulse' : 'bg-zinc-700'}`}></div>
                      <div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Current Status</span>
                        <p className="text-white text-base font-black uppercase tracking-wider mt-0.5">
                          {member.attendanceStatus === 'Present' ? 'Present (In Gym Now)' : 'Absent (Not Logged)'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleToggleAttendance}
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                        member.attendanceStatus === 'Present'
                          ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-lg shadow-emerald-600/10'
                      }`}
                    >
                      {member.attendanceStatus === 'Present' ? 'Mark Absent' : 'Check In Now'}
                    </button>
                  </div>
                </div>

                {/* Profile Details Block */}
                <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-850 space-y-6">
                  <h3 className="font-sans font-black text-lg sm:text-xl uppercase text-white border-b border-zinc-800 pb-3">
                    Personal Profile Details
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm">
                    
                    <div className="flex justify-between py-2 border-b border-zinc-850/50">
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Email</span>
                      <span className="text-zinc-200 truncate max-w-[180px] sm:max-w-none">{member.email}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-zinc-850/50">
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Mobile Number</span>
                      <span className="text-zinc-200">{member.mobileNumber}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-zinc-850/50">
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Age / Gender</span>
                      <span className="text-zinc-200">{member.age} Yrs / {member.gender}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-zinc-850/50">
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Fitness Goal</span>
                      <span className="text-red-400 font-bold">{member.fitnessGoal}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-zinc-850/50 sm:col-span-2">
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Address</span>
                      <span className="text-zinc-200">{member.address}</span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Column: Gym Updates & Contacts */}
              <div className="md:col-span-4 space-y-8">
                
                {/* Announcements Card */}
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-850 space-y-5">
                  <div className="flex items-center space-x-2 text-red-500">
                    <Megaphone size={16} />
                    <h3 className="font-sans font-black text-sm uppercase tracking-widest text-white">Recent Notices</h3>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {announcements.slice(0, 3).map(ann => (
                      <div key={ann.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850/80 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-zinc-500 font-bold">{ann.date}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            ann.type === 'Urgent' ? 'bg-red-600/10 text-red-400 border border-red-500/20' : 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {ann.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-white uppercase leading-snug">{ann.title}</h4>
                        <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Club Contact details */}
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-850 space-y-6">
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase tracking-widest text-white mb-1">MS Fitness Club</h3>
                    <p className="text-zinc-500 text-[11px]">Need to report a problem or freeze membership?</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    
                    <div className="flex items-start space-x-3">
                      <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="block text-[10px] text-zinc-500 uppercase font-bold">Address</span>
                        <p className="text-zinc-300 font-semibold mt-0.5 leading-snug">{settings.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="block text-[10px] text-zinc-500 uppercase font-bold">Phone Support</span>
                        <p className="text-zinc-300 font-semibold mt-0.5">{settings.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="block text-[10px] text-zinc-500 uppercase font-bold">Timings</span>
                        <p className="text-zinc-300 font-semibold mt-0.5 leading-relaxed">{settings.workingHours}</p>
                      </div>
                    </div>

                  </div>

                  {/* Direct Message */}
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider rounded-xl transition-all text-xs flex items-center justify-center space-x-1.5"
                  >
                    <MessageSquare size={13} className="fill-white text-emerald-600" />
                    <span>WhatsApp Reception</span>
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
