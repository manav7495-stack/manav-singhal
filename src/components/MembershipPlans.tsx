import React from 'react';
import { Check, Star } from 'lucide-react';
import { useGym } from '../context/GymContext';

interface MembershipPlansProps {
  onSelectPlan: (planId: string) => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({ onSelectPlan }) => {
  const { plans } = useGym();

  return (
    <section id="plans" className="py-24 bg-zinc-950 text-white relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-xs uppercase tracking-[0.3em] text-brand mb-2">
            Pricing Options
          </h2>
          <p className="font-sans font-black text-4xl sm:text-6xl uppercase text-white tracking-tighter italic">
            MEMBERSHIP PLANS
          </p>
          <div className="w-16 h-1 bg-brand mx-auto mt-4 rounded-sm"></div>
        </div>

        {/* Plans Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-sm p-8 sm:p-10 transition-all duration-300 border ${
                plan.isPopular 
                  ? 'bg-[#0a0a0a] border-brand shadow-2xl md:-translate-y-4' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Popularity Badge */}
              {plan.isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-brand text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-sm flex items-center space-x-1 shadow-lg">
                  <Star size={10} className="fill-black" />
                  <span>Best Value</span>
                </div>
              )}

              {/* Top Details */}
              <div>
                <h3 className="font-sans font-black text-2xl uppercase tracking-wider text-white mb-2 italic">
                  {plan.name}
                </h3>
                
                {/* Price Display */}
                <div className="flex items-baseline mt-4 mb-6">
                  <span className="font-sans font-black text-5xl sm:text-6xl text-white tracking-tight italic">
                    {plan.price}
                  </span>
                  <span className="text-zinc-500 text-xs sm:text-sm ml-2 font-black uppercase tracking-wider italic">
                    / {plan.billing}
                  </span>
                </div>

                <div className={`w-full h-px ${plan.isPopular ? 'bg-brand/20' : 'bg-zinc-800'} my-6`}></div>

                {/* Features List */}
                <ul className="space-y-4 mb-10 text-xs sm:text-sm">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2.5 text-zinc-300">
                      <div className="text-brand font-bold mt-0.5 flex-shrink-0">
                        ✓
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-4 rounded-sm font-black text-xs uppercase tracking-widest transition-colors duration-200 ${
                  plan.isPopular
                    ? 'bg-brand hover:bg-white text-black'
                    : 'bg-zinc-800 hover:bg-brand text-zinc-200 hover:text-black'
                }`}
              >
                Select Plan
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
