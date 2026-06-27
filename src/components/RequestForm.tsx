import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';
import { useGym } from '../context/GymContext';
import { Gender } from '../types';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPlanId?: string;
}

export const RequestForm: React.FC<RequestFormProps> = ({ isOpen, onClose, preselectedPlanId }) => {
  const { plans, addRequest } = useGym();
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    age: '',
    gender: 'Male' as Gender,
    selectedPlanId: '',
    fitnessGoal: '',
    address: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preselectedPlanId) {
      setFormData(prev => ({ ...prev, selectedPlanId: preselectedPlanId }));
    } else if (plans.length > 0 && !formData.selectedPlanId) {
      setFormData(prev => ({ ...prev, selectedPlanId: plans[0].id }));
    }
  }, [preselectedPlanId, plans]);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full name is required';
    if (!formData.mobileNumber.trim()) tempErrors.mobileNumber = 'Mobile number is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email address';
    }

    const ageNum = parseInt(formData.age);
    if (!formData.age) {
      tempErrors.age = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 12 || ageNum > 100) {
      tempErrors.age = 'Age must be between 12 and 100';
    }

    if (!formData.fitnessGoal.trim()) tempErrors.fitnessGoal = 'Please state your fitness goal';
    if (!formData.address.trim()) tempErrors.address = 'Address is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        console.log('Membership form: Submitting request data directly to Supabase via addRequest...');
        await addRequest({
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          age: parseInt(formData.age),
          gender: formData.gender,
          selectedPlanId: formData.selectedPlanId,
          fitnessGoal: formData.fitnessGoal,
          address: formData.address,
          message: formData.message
        });
        console.log('Membership form: Request successfully saved to Supabase!');

        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          // Clear form
          setFormData({
            fullName: '',
            mobileNumber: '',
            email: '',
            age: '',
            gender: 'Male',
            selectedPlanId: plans[0]?.id || '',
            fitnessGoal: '',
            address: '',
            message: ''
          });
          onClose();
        }, 3000);
      } catch (err: any) {
        console.error('Membership form submission failed with error:', err);
        setSubmitError(err?.message || 'Database insert failed. Please check the console for more details.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-sm p-6 sm:p-10 my-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="text-center py-12 flex flex-col items-center justify-center space-y-4">
            <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-sm border border-emerald-500/20 animate-bounce">
              <CheckCircle size={56} className="stroke-[2.5]" />
            </div>
            <h3 className="font-sans font-black text-2xl uppercase tracking-widest text-white italic">
              Application Submitted!
            </h3>
            <p className="text-zinc-400 text-center max-w-md leading-relaxed text-sm sm:text-base">
              Thank you, <span className="text-white font-bold">{formData.fullName}</span>! Your request for the <span className="text-brand font-bold uppercase tracking-wider">{plans.find(p => p.id === formData.selectedPlanId)?.name || 'selected plan'}</span> has been submitted to the admin desk. 
            </p>
            <p className="text-xs text-zinc-500 italic">
              Redirecting you back shortly...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-brand mb-2">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Registration</span>
              </div>
              <h2 className="font-sans font-black text-2xl sm:text-4xl uppercase text-white tracking-tighter italic">
                MEMBERSHIP REQUEST
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Fill in your details below. Our staff will review and approve your entry.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                  Full Name <span className="text-brand">*</span>
                </label>
                <input 
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className={`w-full px-4 py-3 bg-zinc-900 border ${errors.fullName ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
                />
                {errors.fullName && <p className="text-brand text-xs mt-1 font-bold">{errors.fullName}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                  Mobile Number <span className="text-brand">*</span>
                </label>
                <input 
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="e.g. 555-0199"
                  className={`w-full px-4 py-3 bg-zinc-900 border ${errors.mobileNumber ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
                />
                {errors.mobileNumber && <p className="text-brand text-xs mt-1 font-bold">{errors.mobileNumber}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                  Email Address <span className="text-brand">*</span>
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className={`w-full px-4 py-3 bg-zinc-900 border ${errors.email ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
                />
                {errors.email && <p className="text-brand text-xs mt-1 font-bold">{errors.email}</p>}
              </div>

              {/* Age & Gender Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                    Age <span className="text-brand">*</span>
                  </label>
                  <input 
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className={`w-full px-3 py-3 bg-zinc-900 border ${errors.age ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
                  />
                  {errors.age && <p className="text-brand text-xs mt-1 font-bold">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                    Gender <span className="text-brand">*</span>
                  </label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                  Selected Membership Plan <span className="text-brand">*</span>
                </label>
                <select 
                  value={formData.selectedPlanId}
                  onChange={(e) => setFormData({ ...formData, selectedPlanId: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors"
                >
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name} - {plan.price}</option>
                  ))}
                </select>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                  Fitness Goal <span className="text-brand">*</span>
                </label>
                <input 
                  type="text"
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  placeholder="e.g. Gain Muscle, Weight Loss"
                  className={`w-full px-4 py-3 bg-zinc-900 border ${errors.fitnessGoal ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
                />
                {errors.fitnessGoal && <p className="text-brand text-xs mt-1 font-bold">{errors.fitnessGoal}</p>}
              </div>

            </div>

            {/* Full Width Fields */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                Physical Address <span className="text-brand">*</span>
              </label>
              <input 
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street Address, City, State, ZIP"
                className={`w-full px-4 py-3 bg-zinc-900 border ${errors.address ? 'border-brand' : 'border-zinc-800'} rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors`}
              />
              {errors.address && <p className="text-brand text-xs mt-1 font-bold">{errors.address}</p>}
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                Additional Message (Optional)
              </label>
              <textarea 
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write any message, medical condition, or pre-requisite for coaches"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-sm text-white text-sm focus:outline-none focus:border-brand transition-colors resize-none"
              ></textarea>
            </div>

            {submitError && (
              <div className="p-4 bg-brand/10 border border-brand/20 text-brand rounded-sm text-sm font-bold">
                {submitError}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 font-black uppercase tracking-widest rounded-sm transition-colors duration-200 text-xs shadow-lg ${isSubmitting ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none' : 'bg-brand hover:bg-white text-black shadow-brand/10'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
