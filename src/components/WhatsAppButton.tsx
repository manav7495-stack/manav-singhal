import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useGym } from '../context/GymContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useGym();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi ManavDesignLab! I am interested in joining your program. Please share more details.");
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      title="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none flex items-center justify-center animate-bounce hover:animate-none"
    >
      {/* Ripple background effect */}
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 group-hover:opacity-0 transition-opacity"></span>
      <MessageCircle size={26} className="relative z-10 fill-white text-emerald-500 stroke-[2.5]" />
    </button>
  );
};
