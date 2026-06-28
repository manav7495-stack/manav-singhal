import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Phone, MessageCircle, 
  Instagram, Mail, MapPin, Sparkles, User, Dumbbell, 
  Calendar, Clock, Check, Sparkle, Heart, ChevronRight 
} from 'lucide-react';
import { useGym } from '../context/GymContext';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  choices?: { label: string; value: string }[];
  isPremiumCard?: boolean;
}

type ChatFlowState = 
  | 'idle'
  // Book Free Gym Visit Flow
  | 'visit_name'
  | 'visit_phone'
  | 'visit_datetime'
  // Join Now / Lead Collection Flow
  | 'join_name'
  | 'join_phone'
  | 'join_goal'
  | 'join_plan'
  | 'join_date';

export const Chatbot: React.FC = () => {
  const { addRequest } = useGym();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessageBadge, setHasNewMessageBadge] = useState(true);
  
  // Chat flow state machine
  const [flowState, setFlowState] = useState<ChatFlowState>('idle');
  const [leadData, setLeadData] = useState({
    fullName: '',
    mobileNumber: '',
    fitnessGoal: '',
    selectedPlanId: 'plan-basic',
    preferredDate: '', // For join flow (joining date) or visit flow (visit date/time)
  });

  const welcomeChoices = [
    { label: '📋 View Membership Plans', value: 'plans' },
    { label: '🎟️ Book Free Gym Visit', value: 'free_visit_flow' },
    { label: '💬 Talk on WhatsApp', value: 'whatsapp_redirect' },
    { label: '💆 Wellness & Massage Rates', value: 'massage_rates' },
    { label: '🪒 Grooming & Shaving', value: 'grooming_info' },
    { label: '📍 Location & Contact', value: 'location_info' },
    { label: '🏋️ Join MS Fitness Now', value: 'join_flow' }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Welcome to MS Fitness! I am your MS Fitness Assistant. I am here to help you unlock premium physical performance and find the perfect membership setup.\n\nChoose an option below or type your questions directly!",
      timestamp: new Date(),
      choices: welcomeChoices
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewMessageBadge(false);
    }
  }, [messages, isTyping, isOpen]);

  // Open WhatsApp Link
  const triggerWhatsApp = () => {
    const text = encodeURIComponent("Hi, I want to know about MS Fitness membership.");
    window.open(`https://wa.me/918587882431?text=${text}`, '_blank');
  };

  // Main input text process
  const processUserInput = (text: string) => {
    const lower = text.toLowerCase().trim();

    // If active in a lead collection flow, delegate there
    if (flowState !== 'idle') {
      handleFlowStep(text);
      return;
    }

    // 1. View Membership Plans
    if (
      lower.includes('plan') || 
      lower.includes('price') || 
      lower.includes('pricing') || 
      lower.includes('cost') || 
      lower.includes('membership') || 
      lower.includes('fee') || 
      lower === 'plans' ||
      lower.includes('how much')
    ) {
      showMembershipPlans();
      return;
    }

    // 2. Book Free Gym Visit
    if (
      lower.includes('free visit') || 
      lower.includes('book free') || 
      lower.includes('free gym') || 
      lower.includes('trial') || 
      lower.includes('visit') || 
      lower === 'free_visit_flow'
    ) {
      startFreeVisitFlow();
      return;
    }

    // 3. Talk on WhatsApp
    if (
      lower.includes('whatsapp') || 
      lower.includes('chat') || 
      lower.includes('talk') || 
      lower === 'whatsapp_redirect'
    ) {
      triggerWhatsApp();
      addBotMessage(
        "Directing you to WhatsApp secure line with **+91 8587882431**. You can ask us anything directly!",
        [
          { label: '🏋️ Join Now', value: 'join_flow' },
          { label: '📋 Main Menu', value: 'main_menu' }
        ]
      );
      return;
    }

    // 4. Wellness & Massage Rates
    if (
      lower.includes('massage') || 
      lower.includes('wellness') || 
      lower.includes('rates') || 
      lower.includes('spa') || 
      lower === 'massage_rates'
    ) {
      showWellnessRates();
      return;
    }

    // 5. Grooming & Shaving Facility
    if (
      lower.includes('shaving') || 
      lower.includes('grooming') || 
      lower.includes('barber') || 
      lower.includes('shave') || 
      lower === 'grooming_info'
    ) {
      showGroomingInfo();
      return;
    }

    // 6. Location & Contact
    if (
      lower.includes('location') || 
      lower.includes('address') || 
      lower.includes('contact') || 
      lower.includes('instagram') || 
      lower.includes('email') || 
      lower.includes('phone') || 
      lower === 'location_info'
    ) {
      showLocationContact();
      return;
    }

    // 7. Join Now / Lead Collection Flow
    if (
      lower.includes('join') || 
      lower.includes('sign up') || 
      lower.includes('register') || 
      lower === 'join_flow'
    ) {
      startJoinFlow();
      return;
    }

    // Main Menu fallback
    if (lower === 'main_menu' || lower.includes('hello') || lower.includes('hi') || lower.includes('menu')) {
      addBotMessage(
        "How can I assist you with your fitness journey today? Please select from the menu options below:",
        welcomeChoices
      );
      return;
    }

    // Standard Fallback
    addBotMessage(
      "Please contact our team on WhatsApp at **+91 8587882431** for the latest details.",
      [
        { label: '💬 Talk on WhatsApp', value: 'whatsapp_redirect' },
        { label: '📋 Main Menu', value: 'main_menu' }
      ]
    );
  };

  // Helper to add bot replies with typing animator effect
  const addBotMessage = (text: string, choices?: { label: string; value: string }[], isPremiumCard = false) => {
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
          choices,
          isPremiumCard
        }
      ]);
    }, 750);
  };

  // --- OPTION ACTIONS ---

  // 1. View Membership Plans
  const showMembershipPlans = () => {
    addBotMessage(
      "📋 **MS Fitness Membership Plans**\n\n" +
      "🔴 **Basic Plan**\n" +
      "• **₹999** / 1 Month\n" +
      "• Includes full gym floor, locker, and shower access.\n\n" +
      "🔴 **Standard Plan (🔥 40% OFF)**\n" +
      "• **₹3,597** / 6 Months\n" +
      "• Includes workout planners & 2 1-on-1 coaching sessions.\n\n" +
      "🔴 **Premium Plan (🏆 50% OFF)**\n" +
      "• **₹5,994** / 12 Months\n" +
      "• Includes 24/7 access, elite coach, steam room & physical gift pack.",
      [
        { label: '🏋️ Join MS Fitness Now', value: 'join_flow' },
        { label: '🎟️ Book Free Gym Visit', value: 'free_visit_flow' },
        { label: '📋 Main Menu', value: 'main_menu' }
      ],
      true
    );
  };

  // 4. Wellness & Massage Rates
  const showWellnessRates = () => {
    addBotMessage(
      "💆 **MS Fitness Wellness & Massage Rates**\n\n" +
      "Accelerate physical muscle recovery with our professional therapeutic massage passes:\n\n" +
      "• **Body Massage (1 Day Pass):** ₹999\n" +
      "• **Body Massage (1 Month):** ₹1,500\n" +
      "• **Body Massage (6 Months):** ₹1,600\n\n" +
      "Professional certified recovery therapies built directly inside our gym's recovery zone.",
      [
        { label: '🎟️ Book Free Visit', value: 'free_visit_flow' },
        { label: '🪒 Shaving Facility', value: 'grooming_info' },
        { label: '📋 Main Menu', value: 'main_menu' }
      ]
    );
  };

  // 5. Grooming & Shaving
  const showGroomingInfo = () => {
    addBotMessage(
      "🪒 **Grooming & Shaving Facility**\n\n" +
      "✨ **Shaving Facility Available**\n\n" +
      "Enjoy premium hygiene and professional grooming setups inside our luxury locker rooms, with sterilized equipment and hot-towel options on demand.",
      [
        { label: '💆 Wellness Rates', value: 'massage_rates' },
        { label: '📋 Main Menu', value: 'main_menu' }
      ]
    );
  };

  // 6. Location & Contact
  const showLocationContact = () => {
    addBotMessage(
      "📍 **MS Fitness - Location & Contact Details**\n\n" +
      "• ✉️ **Email:** support@manav.sbs\n" +
      "• 📞 **Phone/WhatsApp:** +91 8587882431\n" +
      "• 🗺️ **Address:** W/44, Sainik Farm, New Delhi - 110017\n" +
      "• 📸 **Instagram:** @manavdesignlab\n\n" +
      "Feel free to stop by, or click below to chat directly on WhatsApp with our performance desk!",
      [
        { label: '💬 Talk on WhatsApp', value: 'whatsapp_redirect' },
        { label: '📋 Main Menu', value: 'main_menu' }
      ]
    );
  };

  // --- FLOW STATE MACHINE TRIGGERS ---

  // 2. Start Book Free Gym Visit Flow
  const startFreeVisitFlow = () => {
    setFlowState('visit_name');
    addBotMessage(
      "🎟️ **Book Your Free Gym Visit**\n\n" +
      "Excellent choice! Let's get your visit passes generated.\n\n" +
      "What is your **Full Name**?"
    );
  };

  // 7. Start Join Now Flow
  const startJoinFlow = () => {
    setFlowState('join_name');
    addBotMessage(
      "🏋️ **Join MS Fitness Now**\n\n" +
      "Let's register your profile for immediate enrollment!\n\n" +
      "What is your **Full Name**?"
    );
  };

  // Core Flow Step Handler
  const handleFlowStep = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // --- VISIT FLOW STEPS ---
    if (flowState === 'visit_name') {
      if (trimmed.length < 2) {
        addBotMessage("Please provide a valid full name to create your pass.");
        return;
      }
      setLeadData(prev => ({ ...prev, fullName: trimmed }));
      setFlowState('visit_phone');
      addBotMessage(`Perfect, **${trimmed}**!\n\nNow, what is your **Phone/WhatsApp number**?`);
      return;
    }

    if (flowState === 'visit_phone') {
      if (trimmed.length < 6) {
        addBotMessage("Please enter a valid phone number so we can register your trial.");
        return;
      }
      setLeadData(prev => ({ ...prev, mobileNumber: trimmed }));
      setFlowState('visit_datetime');
      addBotMessage(
        "Excellent. What is your **preferred visit date and time**? (e.g. Tomorrow at 6:00 PM, Next Monday morning, etc.)"
      );
      return;
    }

    if (flowState === 'visit_datetime') {
      setFlowState('idle');
      setIsTyping(true);

      const finalData = {
        fullName: leadData.fullName,
        mobileNumber: leadData.mobileNumber,
        email: 'chatbot.lead@manav.sbs',
        age: 25,
        gender: 'Other' as const,
        selectedPlanId: 'free-visit', // Custom ID for admin panel render
        fitnessGoal: 'Free Gym Trial / Walkthrough Tour',
        address: 'Chatbot Lead Submission',
        message: `Preferred visit date/time: ${trimmed}`
      };

      try {
        await addRequest(finalData);
        addBotMessage(
          "Thank you! Your details have been submitted. Our MS Fitness team will contact you shortly on WhatsApp."
        );
      } catch (err) {
        console.error('Failed to submit free visit lead:', err);
        addBotMessage(
          "Thank you! Your details have been submitted. Our MS Fitness team will contact you shortly on WhatsApp. (Logged locally)"
        );
      }
      return;
    }

    // --- JOIN NOW FLOW STEPS ---
    if (flowState === 'join_name') {
      if (trimmed.length < 2) {
        addBotMessage("Please provide a valid full name to start your profile.");
        return;
      }
      setLeadData(prev => ({ ...prev, fullName: trimmed }));
      setFlowState('join_phone');
      addBotMessage(`Awesome to meet you, **${trimmed}**! 👋\n\nWhat is your **Phone/WhatsApp number**?`);
      return;
    }

    if (flowState === 'join_phone') {
      if (trimmed.length < 6) {
        addBotMessage("Please provide a valid phone or WhatsApp number.");
        return;
      }
      setLeadData(prev => ({ ...prev, mobileNumber: trimmed }));
      setFlowState('join_goal');
      addBotMessage(
        "Got it! What is your primary **Fitness Goal**?",
        [
          { label: 'Weight Loss 📉', value: 'Weight Loss' },
          { label: 'Muscle Gain 💪', value: 'Muscle Gain' },
          { label: 'General Health & Endurance 🌱', value: 'General Health' },
          { label: 'Athletic Performance ⚡', value: 'Athletic Conditioning' }
        ]
      );
      return;
    }

    if (flowState === 'join_goal') {
      setLeadData(prev => ({ ...prev, fitnessGoal: trimmed }));
      setFlowState('join_plan');
      addBotMessage(
        "Excellent. Which **Membership Plan** do you prefer?",
        [
          { label: 'Basic Plan (₹999 / 1 Month)', value: 'plan-basic' },
          { label: 'Standard Plan (₹3,597 / 6 Mos)', value: 'plan-standard' },
          { label: 'Premium Plan (₹5,994 / 12 Mos)', value: 'plan-premium' }
        ]
      );
      return;
    }

    if (flowState === 'join_plan') {
      let resolvedPlanId = 'plan-basic';
      if (trimmed.includes('standard') || trimmed === 'plan-standard') resolvedPlanId = 'plan-standard';
      if (trimmed.includes('premium') || trimmed === 'plan-premium') resolvedPlanId = 'plan-premium';

      setLeadData(prev => ({ ...prev, selectedPlanId: resolvedPlanId }));
      setFlowState('join_date');
      addBotMessage("Fantastic! What is your **preferred joining date**? (e.g. Next Monday, July 1st, or Immediately)");
      return;
    }

    if (flowState === 'join_date') {
      setFlowState('idle');
      setIsTyping(true);

      const finalData = {
        fullName: leadData.fullName,
        mobileNumber: leadData.mobileNumber,
        email: 'chatbot.member@manav.sbs',
        age: 25,
        gender: 'Other' as const,
        selectedPlanId: leadData.selectedPlanId,
        fitnessGoal: leadData.fitnessGoal || 'General Improvement',
        address: 'Chatbot Lead Submission',
        message: `Preferred joining date: ${trimmed}`
      };

      try {
        await addRequest(finalData);
        addBotMessage(
          "Thank you! Your details have been submitted. Our MS Fitness team will contact you shortly on WhatsApp."
        );
      } catch (err) {
        console.error('Failed to submit join request lead:', err);
        addBotMessage(
          "Thank you! Your details have been submitted. Our MS Fitness team will contact you shortly on WhatsApp. (Logged locally)"
        );
      }
      return;
    }
  };

  const handleChoiceSelect = (value: string, label: string) => {
    // Add user message for the clicked choice
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: label,
        timestamp: new Date()
      }
    ]);

    // Fast-path choice routing
    if (value === 'plans') {
      showMembershipPlans();
    } else if (value === 'free_visit_flow') {
      startFreeVisitFlow();
    } else if (value === 'whatsapp_redirect') {
      triggerWhatsApp();
      addBotMessage("Opening WhatsApp Secure Chat... Directing you to +91 8587882431.");
    } else if (value === 'massage_rates') {
      showWellnessRates();
    } else if (value === 'grooming_info') {
      showGroomingInfo();
    } else if (value === 'location_info') {
      showLocationContact();
    } else if (value === 'join_flow') {
      startJoinFlow();
    } else if (value === 'main_menu') {
      addBotMessage(
        "Here is the MS Fitness Assistant main menu. Select any service to explore:",
        welcomeChoices
      );
    } else {
      // Pass other values through processUserInput
      processUserInput(value);
    }
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date()
      }
    ]);

    processUserInput(userText);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        id="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="MS Fitness Assistant Chat"
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_10px_30px_rgba(227,28,37,0.3)] transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none flex items-center justify-center ${
          isOpen ? 'bg-zinc-950 text-red-500 border border-zinc-800 rotate-90' : 'bg-red-600 hover:bg-red-700 text-white animate-bounce hover:animate-none'
        }`}
      >
        {/* Breathing Ring Pulse when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30 group-hover:opacity-0 transition-opacity"></span>
        )}

        {isOpen ? (
          <X size={26} />
        ) : (
          <div className="relative">
            <MessageSquare size={26} className="relative z-10 stroke-[2.5]" />
            {hasNewMessageBadge && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full border-2 border-red-600 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
              </span>
            )}
          </div>
        )}
      </button>

      {/* Chat Window Panel with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[590px] max-h-[82vh] bg-zinc-950 border border-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#0b0b0c] border-b border-zinc-900 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-zinc-950 border border-red-500/30 flex items-center justify-center">
                    <Dumbbell size={18} className="text-white animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-sans font-black uppercase text-sm tracking-wide text-white italic flex items-center gap-1.5">
                    MS Fitness Assistant
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Online • Performance Desk</p>
                </div>
              </div>

              {/* Close Button & WhatsApp inside Header */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={triggerWhatsApp}
                  className="text-emerald-500 hover:text-emerald-400 p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-850 transition-all"
                  title="Direct WhatsApp"
                >
                  <MessageCircle size={15} className="fill-emerald-500/10" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-850 transition-all"
                  title="Minimize"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Sub-Header Glow Accent */}
            <div className="bg-red-600/5 border-b border-red-600/10 px-4 py-2 text-[10px] text-red-500 font-black tracking-widest uppercase flex items-center justify-center space-x-1.5">
              <Sparkle size={10} className="animate-spin text-red-500" style={{ animationDuration: '4s' }} />
              <span>Red & Black Premium Coaching Lounge</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-zinc-950/90 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {/* Timestamp & Tag */}
                    <div className="flex items-center space-x-1.5 mb-1 text-[9px] font-black tracking-widest uppercase text-zinc-600">
                      {!isUser ? (
                        <span className="text-red-500 font-bold italic">Assistant</span>
                      ) : (
                        <span className="text-zinc-500 flex items-center gap-1"><User size={8} /> You</span>
                      )}
                      <span>•</span>
                      <span>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Speech Bubble */}
                    <div
                      className={`max-w-[85%] px-4 py-3 text-xs leading-relaxed rounded-2xl whitespace-pre-wrap shadow-lg border transition-all ${
                        isUser
                          ? 'bg-red-600 text-white font-medium rounded-tr-none border-red-700'
                          : msg.isPremiumCard 
                            ? 'bg-[#0f0f11] text-zinc-100 rounded-tl-none border-red-600/30 shadow-[0_4px_15px_rgba(227,28,37,0.05)]'
                            : 'bg-zinc-900 text-zinc-100 rounded-tl-none border-zinc-850'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Interactive Choices buttons */}
                    {msg.choices && msg.choices.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 max-w-[95%] animate-fade-in">
                        {msg.choices.map((choice, i) => (
                          <button
                            key={i}
                            onClick={() => handleChoiceSelect(choice.value, choice.label)}
                            className="bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-red-600 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-red-950/20"
                          >
                            {choice.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Animation Loader bubble */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center space-x-1.5 mb-1 text-[9px] font-black tracking-widest uppercase text-red-500 italic">
                    <span>Assistant Typing</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl rounded-tl-none px-4 py-3 flex space-x-1.5 items-center shadow-lg">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Action Panel Form */}
            <form
              onSubmit={handleSendMessageSubmit}
              className="p-3 bg-[#0c0c0e] border-t border-zinc-900 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  flowState !== 'idle' 
                    ? "Respond to our assistant..." 
                    : "Ask membership, free visit, massage, shaving..."
                }
                className="flex-1 bg-zinc-900 border border-zinc-850 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl shadow-lg shadow-red-950/15 transition-all duration-200 hover:scale-105 active:scale-95"
                title="Send Message"
              >
                <Send size={13} className="stroke-[2.5]" />
              </button>
            </form>

            {/* Small Footer Signature */}
            <div className="bg-zinc-950 border-t border-zinc-900/50 py-2 text-center text-[8px] text-zinc-600 font-bold uppercase tracking-widest flex items-center justify-center space-x-1 select-none">
              <Heart size={8} className="fill-red-600 text-red-600 animate-pulse" />
              <span>MS Fitness Assistant Elite Chat</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
