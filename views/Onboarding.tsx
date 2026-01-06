
import React, { useState } from 'react';
import { Button } from '../components/UI';
import { Sparkles, Target, DollarSign, ShieldCheck, ChevronRight, Gem, Crown } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "Clarity over Hustle.",
    description: "Welcome to your financial sanctuary. This isn't just a tracker—it's your strategy for freedom and boundaries.",
    icon: <Sparkles className="text-primary w-16 h-16" />,
    color: "from-primary/20 to-black"
  },
  {
    title: "Track the Bag.",
    description: "Log your nightly earnings after house fees and tip-outs. Know exactly what's hitting your pocket every single shift.",
    icon: <DollarSign className="text-primary w-16 h-16" />,
    color: "from-primary/10 to-black"
  },
  {
    title: "Crush the Targets.",
    description: "Set your weekly goals. We'll tell you exactly how many nights you need to work to secure the lifestyle you deserve.",
    icon: <Target className="text-primary w-16 h-16" />,
    color: "from-primary/5 to-black"
  },
  {
    title: "Own Your Self-Care.",
    description: "Track hair, nails, and outfits as business write-offs. Maintain the glam with total financial clarity.",
    icon: <Crown className="text-primary w-16 h-16" />,
    color: "from-primary/20 to-black"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skip = () => onComplete();

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b ${slides[currentSlide].color} transition-all duration-1000 ease-in-out`}>
      <div className="w-full flex justify-end">
        <button onClick={skip} className="text-gray-500 font-bold text-[10px] hover:text-white uppercase tracking-[0.3em] py-2">Skip Intro</button>
      </div>

      <div key={currentSlide} className="flex-1 flex flex-col items-center justify-center text-center max-w-xs space-y-10 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="relative p-8 bg-secondary/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl neon-glow">
            {slides[currentSlide].icon}
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-glam italic text-white leading-tight drop-shadow-sm">
            {slides[currentSlide].title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed font-medium">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      <div className="w-full space-y-8 pb-4">
        {/* Pagination Dots */}
        <div className="flex justify-center gap-3">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all rounded-full duration-500 ${
                i === currentSlide 
                  ? 'w-10 bg-primary shadow-[0_0_12px_rgba(255,0,127,1)]' 
                  : 'w-2 bg-gray-800'
              }`} 
            />
          ))}
        </div>

        <Button 
          onClick={nextSlide} 
          className="w-full py-5 text-xl flex items-center justify-center gap-3 group relative overflow-hidden"
        >
          <span className="relative z-10">
            {currentSlide === slides.length - 1 ? "Let's Glow" : "Next Step"}
          </span>
          <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
          {currentSlide === slides.length - 1 && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-[shimmer_2s_infinite] opacity-50"></div>
          )}
        </Button>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
