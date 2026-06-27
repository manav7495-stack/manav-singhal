import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { useGym } from '../context/GymContext';

export const ContactForm: React.FC = () => {
  const { settings, addContactResponse } = useGym();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.phone.trim()) tempErrors.phone = 'Phone number is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email address';
    }

    if (!formData.message.trim()) tempErrors.message = 'Message is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      addContactResponse({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message
      });

      setIsSuccess(true);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 text-white relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-xs uppercase tracking-[0.3em] text-brand mb-2">
            Get In Touch
          </h2>
          <p className="font-sans font-black text-4xl sm:text-6xl uppercase text-white tracking-tighter italic">
            CONTACT MS FITNESS
          </p>
          <div className="w-16 h-1 bg-brand mx-auto mt-4 rounded-sm"></div>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Gym Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 rounded-sm bg-zinc-900 border border-zinc-850">
            <div className="space-y-8">
              <div>
                <h3 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tighter italic text-white mb-2">
                  LOCATE OUR CLUB
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Have questions about memberships, personal coaches, or corporate offers? Drop by or give us a call. We are open year-round.
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-sm bg-zinc-950 border border-zinc-800 text-brand">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Our Address</h4>
                    <p className="text-zinc-200 text-sm font-semibold mt-1 leading-relaxed">
                      {settings.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-sm bg-zinc-950 border border-zinc-800 text-brand">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Call or WhatsApp</h4>
                    <p className="text-zinc-200 text-sm font-semibold mt-1">
                      {settings.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-sm bg-zinc-950 border border-zinc-800 text-brand">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</h4>
                    <p className="text-zinc-200 text-sm font-semibold mt-1 truncate">
                      {settings.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-sm bg-zinc-950 border border-zinc-800 text-brand">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Working Hours</h4>
                    <p className="text-zinc-200 text-xs sm:text-sm font-semibold mt-1 leading-relaxed">
                      {settings.workingHours}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Note */}
            <div className="border-t border-zinc-800 pt-6 mt-8 text-xs text-zinc-500 uppercase tracking-wider font-bold">
              * Response time for submitted online messages is typically under 4 business hours.
            </div>
          </div>

          {/* Contact Feedback Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-sm bg-[#0a0a0a] border border-zinc-900 flex flex-col justify-center">
            
            {isSuccess && (
              <div className="mb-6 p-4 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-start space-x-3 text-sm">
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Message sent successfully!</h4>
                  <p className="text-zinc-400 text-xs mt-1">Thank you for writing. Our athletic coordinators will reach out shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                    Your Name <span className="text-brand">*</span>
                  </label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-zinc-900 border ${errors.name ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
                  />
                  {errors.name && <p className="text-brand text-xs mt-1 font-bold">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                    Phone Number <span className="text-brand">*</span>
                  </label>
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 555-0100"
                    className={`w-full px-4 py-3 bg-zinc-900 border ${errors.phone ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
                  />
                  {errors.phone && <p className="text-brand text-xs mt-1 font-bold">{errors.phone}</p>}
                </div>

              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                  Email Address <span className="text-brand">*</span>
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@outlook.com"
                  className={`w-full px-4 py-3 bg-zinc-900 border ${errors.email ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
                />
                {errors.email && <p className="text-brand text-xs mt-1 font-bold">{errors.email}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                  Your Message <span className="text-brand">*</span>
                </label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ask us anything about training schedules, plans, or guidelines..."
                  className={`w-full px-4 py-3 bg-zinc-900 border ${errors.message ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors resize-none`}
                ></textarea>
                {errors.message && <p className="text-brand text-xs mt-1 font-bold">{errors.message}</p>}
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="w-full py-4 bg-brand hover:bg-white text-black font-black uppercase tracking-widest rounded-sm transition-colors duration-200 text-xs shadow-md shadow-brand/10"
                >
                  Send Message
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
