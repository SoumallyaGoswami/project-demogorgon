import React from "react";

const Radar = ({ targets = [] }) => {
  return (
    <div className="relative w-full h-full bg-black rounded-full border-2 border-[#ff4d4d]/30 overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.15)]">
      {/* Radar Grid Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-full h-full border border-[#ff4d4d]/20 rounded-full scale-[0.25]"></div>
        <div className="absolute w-full h-full border border-[#ff4d4d]/15 rounded-full scale-[0.5]"></div>
        <div className="absolute w-full h-full border border-[#ff4d4d]/10 rounded-full scale-[0.75]"></div>
        <div className="absolute w-full h-full border border-[#ff4d4d]/5 rounded-full"></div>
        
        {/* Axes */}
        <div className="absolute w-full h-[1px] bg-[#ff4d4d]/20"></div>
        <div className="absolute h-full w-[1px] bg-[#ff4d4d]/20"></div>
      </div>

      {/* Radar Sweep Animation */}
      <div className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite] pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, rgba(255, 77, 77, 0.3) 0deg, transparent 90deg)'
        }}
      ></div>

      {/* Targets */}
      {targets.map((target) => {
        // screenX = ((x + 50) / 100) * 100%
        const screenX = ((target.position.x + 50)); 
        const screenY = ((target.position.y + 50));
        
        // Signal Strength Styling
        let dotSize = "w-2 h-2";
        let glowColor = "shadow-[0_0_10px_#ff0000]";
        let bgColor = "bg-[#ff0000]";
        let opacity = "opacity-100";

        if (target.strength === "strong") {
          dotSize = "w-4 h-4";
          glowColor = "shadow-[0_0_20px_#ff0000]";
          bgColor = "bg-[#ff0000]";
        } else if (target.strength === "medium") {
          dotSize = "w-3 h-3";
          glowColor = "shadow-[0_0_15px_#ffa500]";
          bgColor = "bg-[#ffa500]";
        } else if (target.strength === "weak") {
          dotSize = "w-2 h-2";
          glowColor = "shadow-[0_0_5px_#8b0000]";
          bgColor = "bg-[#8b0000]";
          opacity = "opacity-60";
        }

        return (
          <div 
            key={target.id}
            className={`absolute -translate-x-1/2 translate-y-1/2 transition-all duration-1000 ease-in-out ${opacity}`}
            style={{ left: `${screenX}%`, bottom: `${screenY}%` }}
          >
            <div className={`relative group`}>
              {/* Blip */}
              <div className={`${dotSize} rounded-full ${bgColor} ${glowColor} animate-pulse`} />
              
              {/* Label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-black/80 px-1 py-0.5 border border-[#ff4d4d]/30 text-[8px] uppercase tracking-tighter">
                {target.name}
              </div>

              {/* Ping Ring for Strong Signals */}
              {target.strength === "strong" && (
                <div className="absolute -inset-2 border border-red-500/50 rounded-full animate-ping"></div>
              )}
            </div>
          </div>
        );
      })}

      {/* CSS for spin animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Radar;