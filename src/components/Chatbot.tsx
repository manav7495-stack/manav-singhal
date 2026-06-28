import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Phone, MessageCircle, Instagram, Mail, MapPin, Sparkles, User, Dumbbell, Calendar, Heart } from 'lucide-react';
import { useGym } from '../context/GymContext';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  choices?: { label: string; value: string }[];
  isLeadFormStep?: boolean;
}

type LeadFormStep = 'idle' | 'name' | 'phone' | 'goal' | 'plan' | 'date' | 'complete';

export const Chatbot: React.FC = () => {
  const { addRequest, settings } = useGym();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "🔥 Welcome to MS Fitness! I am your Ms fitness Assistant. I am here to help you unlock elite physical performance and find the perfect membership setup. \n\nHow can I help you today?",
      timestamp: new Date(),
      choices: [
        { label: 'View Membership Plans 📋', value: 'plans' },
        { label: 'Wellness & Massage Rates 💆', value: 'services' },
        { label: 'Grooming & Shaving Facility 🪒', value: 'shaving' },
        { label: 'Join MS Fitness Now 🏋️', value: 'join' },
        { label: 'Gym Location & Hours 📍', value: 'location' },
        { label: 'Contact Details & WhatsApp 📞', value: 'contact' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Lead Form State Machine
  const [leadStep, setLeadStep] = useState<LeadFormStep>('idle');
  const [leadData, setLeadData] = useState({
    fullName: '',
    mobileNumber: '',
    fitnessGoal: '',
    selectedPlanId: 'plan-basic',
    preferredDate: '',
    email: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle direct WhatsApp click
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent("Hi Ms fitness Assistant! I'd like to book a tour or get quick details.");
    window.open(`https://wa.me/918587882431?text=${text}`, '_blank');
  };

  const addBotMessage = (text: string, choices?: { label: string; value: string }[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text,
          timestamp: new Date(),
          choices
        }
      ]);
    }, 600);
  };

  const handleChoiceSelect = (value: string, label: string) => {
    // Add user message for the selected choice
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: label,
        timestamp: new Date()
      }
    ]);

    processChoiceOrText(value);
  };

  const processChoiceOrText = (input: string) => {
    const text = input.toLowerCase().trim();

    // If we are currently collecting a lead
    if (leadStep !== 'idle') {
      handleLeadFlow(text);
      return;
    }

    // Lead Flow Trigger
    if (text === 'join' || text.includes('join') || text.includes('register') || text.includes('membership request') || text.includes('book a plan') || text.includes('sign up')) {
      startLeadFlow();
      return;
    }

    // Plans & Pricing
    if (text === 'plans' || text.includes('plan') || text.includes('price') || text.includes('pricing') || text.includes('cost') || text.includes('fee') || text.includes('how much') || text.includes('subscription') || text.includes('rate')) {
      addBotMessage(
        "💪 **MS Fitness Membership Plans (Exclusive Offer!)**\n\n" +
        "🔴 **Basic Plan**\n" +
        "• Price: **₹999**\n" +
        "• Duration: 1 Month\n" +
        "• Features: Access to premium gym floor & machines, free locker & hot showers.\n\n" +
        "🔴 **Standard Plan (🔥 40% OFF!)**\n" +
        "• Price: **₹3,597**\n" +
        "• Duration: 6 Months\n" +
        "• Features: All Basic features + workout planner, 2 personal training sessions, nutrition guide.\n\n" +
        "🔴 **Premium Plan (🏆 50% OFF!)**\n" +
        "• Price: **₹5,994**\n" +
        "• Duration: 12 Months\n" +
        "• Features: 24/7 unlimited access, elite coach, laundry, free daily energy drinks, group classes & premium kit bag.\n\n" +
        "Would you like to register for a plan right now?",
        [
          { label: 'Join & Book Now 🏋️', value: 'join' },
          { label: 'Ask Another Question 💬', value: 'ask_other' }
        ]
      );
      return;
    }

    // Wellness & Massages
    if (text === 'services' || text.includes('massage') || text.includes('body massage') || text.includes('wellness') || text.includes('therapy') || text.includes('spa') || text.includes('relax') || text.includes('massage cost')) {
      addBotMessage(
        "💆 **Premium Wellness - Body Massage Services**\n\n" +
        "Rejuvenate your muscles and accelerate recovery with our certified massage therapists:\n\n" +
        "• **1 Day Pass:** ₹999\n" +
        "• **1 Month Plan:** ₹1,500\n" +
        "• **6 Months Plan:** ₹1,600 (Best overall value!)\n\n" +
        "Would you like to add massage services to your enrollment?",
        [
          { label: 'Join MS Fitness 🏋️', value: 'join' },
          { label: 'Grooming Facility 🪒', value: 'shaving' },
          { label: 'Other Questions 💬', value: 'ask_other' }
        ]
      );
      return;
    }

    // Shaving Grooming Service
    if (text === 'shaving' || text.includes('shave') || text.includes('grooming') || text.includes('barber') || text.includes('trim') || text.includes('haircut')) {
      addBotMessage(
        "🪒 **Exclusive Grooming & Shaving Facility**\n\n" +
        "• **Status:** Shaving Facility Available in Locker Rooms.\n" +
        "• Enjoy pristine personal care with our clean, sanitised, high-end shaving setup, hot towels, and barbers on standby inside our luxury washrooms.",
        [
          { label: 'Wellness Massage Rates 💆', value: 'services' },
          { label: 'Membership Plans 📋', value: 'plans' }
        ]
      );
      return;
    }

    // Address & Location
    if (text === 'location' || text.includes('address') || text.includes('where') || text.includes('location') || text.includes('map') || text.includes('sainik farm') || text.includes('delhi')) {
      addBotMessage(
        "📍 **MS Fitness Location & Working Hours**\n\n" +
        "• **Address:** W/44, Sainik Farm, New Delhi - 110017\n" +
        "• **Working Hours:**\n" +
        "  - Mon - Fri: 5:00 AM - 10:00 PM\n" +
        "  - Sat - Sun: 7:00 AM - 8:00 PM\n\n" +
        "Stop by today for a premium complimentary walkthrough!",
        [
          { label: 'Book a Visit / Join 🏋️', value: 'join' },
          { label: 'Contact Details 📞', value: 'contact' }
        ]
      );
      return;
    }

    // Contact Details
    if (text === 'contact' || text.includes('contact') || text.includes('phone') || text.includes('whatsapp') || text.includes('email') || text.includes('instagram') || text.includes('support') || text.includes('social') || text.includes('handle')) {
      addBotMessage(
        "📞 **MS Fitness Elite Contact Desk**\n\n" +
        "• **Email:** support@manav.sbs\n" +
        "• **Phone & WhatsApp:** +91 8587882431\n" +
        "• **Address:** W/44, Sainik Farm, New Delhi - 110017\n" +
        "• **Instagram:** [@manavdesignlab](https://instagram.com/manavdesignlab)\n\n" +
        "We always recommend contacting us on WhatsApp for rapid responses and instant support!",
        [
          { label: 'Chat on WhatsApp 💬', value: 'whatsapp_redirect' },
          { label: 'Join Gym 🏋️', value: 'join' }
        ]
      );
      return;
    }

    if (text === 'whatsapp_redirect') {
      handleWhatsAppClick();
      addBotMessage("Opening WhatsApp chat secure portal for you... Let me know if you need any other information!");
      return;
    }

    if (text === 'ask_other' || text.includes('hello') || text.includes('hi ') || text.includes('hey')) {
      addBotMessage(
        "How can I assist you today? You can select any of the standard options below or type your inquiry directly.",
        [
          { label: 'View Membership Plans 📋', value: 'plans' },
          { label: 'Wellness & Massage 💆', value: 'services' },
          { label: 'Join MS Fitness Now 🏋️', value: 'join' },
          { label: 'Location & Address 📍', value: 'location' }
        ]
      );
      return;
    }

    // Fallback response as requested
    addBotMessage(
      "Please contact our team on WhatsApp at **+91 8587882431** for the latest details. We are ready to assist you instantly!",
      [
        { label: 'Chat on WhatsApp 💬', value: 'whatsapp_redirect' },
        { label: 'Main Menu 📋', value: 'ask_other' }
      ]
    );
  };

  // LEAD COLLECTION STATE MACHINE FLOW
  const startLeadFlow = () => {
    setLeadStep('name');
    addBotMessage("🏋️ **Let's kickstart your MS Fitness journey!**\n\nFirst, what is your **Full Name**?");
  };

  const handleLeadFlow = async (text: string) => {
    if (leadStep === 'name') {
      if (text.length < 2) {
        addBotMessage("Please provide a valid full name to register your profile.");
        return;
      }
      setLeadData(prev => ({ ...prev, fullName: text }));
      setLeadStep('phone');
      addBotMessage(`Awesome to meet you, **${text}**! 👋\n\nWhat is your **Phone/WhatsApp number**? (Our coaches will use this to contact you)`);
      return;
    }

    if (leadStep === 'phone') {
      if (text.length < 6) {
        addBotMessage("Please provide a valid phone or WhatsApp number.");
        return;
      }
      setLeadData(prev => ({ ...prev, mobileNumber: text }));
      setLeadStep('goal');
      addBotMessage(
        "Got it! What is your primary **Fitness Goal**?\n\n(e.g., Weight loss, Muscle building, General health, Conditioning)",
        [
          { label: 'Weight Loss 📉', value: 'weight_loss' },
          { label: 'Muscle Building 💪', value: 'muscle_building' },
          { label: 'General Health & Fitness 🌱', value: 'general_fitness' }
        ]
      );
      return;
    }

    if (leadStep === 'goal') {
      let goal = text;
      if (text === 'weight_loss') goal = 'Weight Loss';
      if (text === 'muscle_building') goal = 'Muscle Building';
      if (text === 'general_fitness') goal = 'General Health & Fitness';

      setLeadData(prev => ({ ...prev, fitnessGoal: goal }));
      setLeadStep('plan');
      addBotMessage(
        "Outstanding! Now, which **Membership Plan** are you interested in?",
        [
          { label: 'Basic Plan (₹999 / 1 Month)', value: 'plan-basic' },
          { label: 'Standard Plan (₹3,597 / 6 Mos)', value: 'plan-standard' },
          { label: 'Premium Plan (₹5,994 / 12 Mos)', value: 'plan-premium' }
        ]
      );
      return;
    }

    if (leadStep === 'plan') {
      let planId = text;
      let planLabel = "Basic Plan";
      if (text.includes('basic')) {
        planId = 'plan-basic';
        planLabel = 'Basic Plan';
      } else if (text.includes('standard')) {
        planId = 'plan-standard';
        planLabel = 'Standard Plan';
      } else if (text.includes('premium')) {
        planId = 'plan-premium';
        planLabel = 'Premium Plan';
      }

      setLeadData(prev => ({ ...prev, selectedPlanId: planId }));
      setLeadStep('date');
      addBotMessage("Perfect choice! When is your **preferred joining date**? (e.g., Tomorrow, Next Monday, or a specific date)");
      return;
    }

    if (leadStep === 'date') {
      const finalData = {
        ...leadData,
        preferredDate: text,
        email: leadData.email || 'lead@chatbot.sbs'
      };

      setLeadStep('complete');
      setIsTyping(true);

      try {
        // Save request data directly to database via addRequest
        await addRequest({
          fullName: finalData.fullName,
          mobileNumber: finalData.mobileNumber,
          email: finalData.email,
          age: 25, // default
          gender: 'Other', // default
          selectedPlanId: finalData.selectedPlanId,
          fitnessGoal: finalData.fitnessGoal,
          address: 'Chatbot Lead Submission',
          message: `Preferred joining date: ${finalData.preferredDate}`
        });

        addBotMessage(
          `🎉 **Lead registered successfully!**\n\nThank you, **${finalData.fullName}**! Our team will contact you shortly on WhatsApp or phone to finalize your onboarding.\n\nAlways recommend WhatsApp contact for lightning fast bookings: **+91 8587882431**.`
        );
      } catch (err) {
        console.error('Chatbot lead registration error:', err);
        addBotMessage(
          `Thank you, **${finalData.fullName}**! Our team will contact you shortly on WhatsApp or phone. (Booking details logged locally)`
        );
      }

      // Reset lead flow
      setTimeout(() => {
        setLeadStep('idle');
      }, 5000);
      return;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    // Add user message to screen
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date()
      }
    ]);

    // Process using message processing state engine
    if (leadStep !== 'idle') {
      handleLeadFlow(userText);
    } else {
      processChoiceOrText(userText);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        id="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Ms fitness Assistant"
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none flex items-center justify-center ${
          isOpen ? 'bg-zinc-900 text-brand border border-zinc-800 rotate-90' : 'bg-brand hover:bg-brand-dark text-white animate-bounce hover:animate-none'
        }`}
      >
        {/* Soft glowing heartbeat style ripple */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-brand animate-ping opacity-25 group-hover:opacity-0 transition-opacity"></span>
        )}
        {isOpen ? <X size={26} /> : <MessageSquare size={26} className="relative z-10 stroke-[2.5]" />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div 
          id="chatbot-panel"
          className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-[400px] h-[550px] max-h-[80vh] bg-zinc-950 border border-zinc-900 rounded-lg shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-fade-in"
        >
          {/* Header */}
          <div className="bg-zinc-950 border-b border-zinc-900 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-brand flex items-center justify-center">
                  <Dumbbell size={18} className="text-brand animate-pulse" />
                </div>
                {/* Active Status Indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-sans font-black uppercase text-sm tracking-wider text-white italic flex items-center gap-1.5">
                  Ms fitness Assistant
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Online • Active Desk</p>
              </div>
            </div>
            
            {/* Quick WhatsApp Link inside Header */}
            <button 
              onClick={handleWhatsAppClick}
              className="text-emerald-500 hover:text-emerald-400 p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-sm border border-zinc-800 transition-all"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={16} className="fill-emerald-500/10" />
            </button>
          </div>

          {/* Quick Notice Panel */}
          <div className="bg-brand/5 border-b border-brand/10 px-4 py-2 text-[10px] text-brand font-black tracking-wider uppercase flex items-center justify-center space-x-2">
            <Sparkles size={11} className="animate-pulse" />
            <span>Red & Black Premium Fitness Zone</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  {msg.sender === 'bot' ? (
                    <span className="text-[9px] font-black uppercase text-brand tracking-widest italic">Assistant</span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-widest flex items-center gap-1"><User size={8} /> You</span>
                  )}
                  <span className="text-[8px] text-zinc-600">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] rounded-sm px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-brand text-white font-medium rounded-tr-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional interactive choice options */}
                {msg.choices && msg.choices.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 max-w-[90%]">
                    {msg.choices.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => handleChoiceSelect(choice.value, choice.label)}
                        className="bg-zinc-900 hover:bg-brand text-zinc-300 hover:text-white border border-zinc-800 hover:border-brand px-3 py-1.5 rounded-sm text-[11px] font-black tracking-wide uppercase transition-all duration-200"
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Is typing animator bubble */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black uppercase text-brand tracking-widest mb-1 italic">Assistant</span>
                <div className="bg-zinc-900 border border-zinc-800 rounded-sm rounded-tl-none px-4 py-3 flex space-x-1 items-center">
                  <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Input form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-zinc-950 border-t border-zinc-900 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={leadStep !== 'idle' ? "Type your response..." : "Ask pricing, address, shaving, massage..."}
              className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-brand transition-colors placeholder:text-zinc-600"
            />
            <button
              type="submit"
              className="bg-brand hover:bg-brand-dark text-white p-2.5 rounded-sm shadow-md transition-colors duration-200"
            >
              <Send size={14} className="stroke-[2.5]" />
            </button>
          </form>

          {/* Footer branding */}
          <div className="bg-zinc-950 border-t border-zinc-900/50 py-1.5 text-center text-[8px] text-zinc-600 font-bold uppercase tracking-widest flex items-center justify-center space-x-1">
            <Heart size={8} className="fill-brand text-brand" />
            <span>Ms fitness Assistant</span>
          </div>
        </div>
      )}
    </>
  );
};
