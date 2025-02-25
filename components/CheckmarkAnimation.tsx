import { useEffect, useState } from "react";

export default function CheckmarkAnimation() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`transform transition-transform duration-500 ${animate ? 'scale-100' : 'scale-0'}`}>
        <div className="relative">
          {/* Outer ripple effect */}
          <div className={`absolute inset-0 rounded-full bg-green-500/20 animate-ping`} />
          
          {/* Middle circle */}
          <div className={`w-32 h-32 rounded-full bg-green-500/30 flex items-center justify-center 
            ${animate ? 'animate-[scale-up_0.5s_ease-out]' : ''}`}>
            
            {/* Inner circle with checkmark */}
            <div className={`w-24 h-24 rounded-full bg-green-500 flex items-center justify-center 
              ${animate ? 'animate-[bounce-in_0.6s_cubic-bezier(0.34,1.56,0.64,1)]' : ''}`}>
              <svg 
                className={`w-16 h-16 text-white transform 
                  ${animate ? 'animate-[draw-check_0.8s_ease-out_forwards]' : 'opacity-0'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="3"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}