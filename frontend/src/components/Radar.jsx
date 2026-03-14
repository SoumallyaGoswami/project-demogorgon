import React from "react";

const Radar = ({ targets = [] }) => {

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  return (
    <div className="relative w-full h-full bg-black rounded-full border-2 border-[#ff4d4d]/30 overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.15)]">

      {/* Radar Grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-full h-full border border-[#ff4d4d]/20 rounded-full scale-[0.25]"></div>
        <div className="absolute w-full h-full border border-[#ff4d4d]/15 rounded-full scale-[0.5]"></div>
        <div className="absolute w-full h-full border border-[#ff4d4d]/10 rounded-full scale-[0.75]"></div>
        <div className="absolute w-full h-full border border-[#ff4d4d]/5 rounded-full"></div>

        {/* Axes */}
        <div className="absolute w-full h-[1px] bg-[#ff4d4d]/20"></div>
        <div className="absolute h-full w-[1px] bg-[#ff4d4d]/20"></div>
      </div>

      {/* Radar Sweep */}
      <div
        className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite] pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(255, 77, 77, 0.25) 0deg, transparent 90deg)"
        }}
      ></div>

      {/* Targets */}
      {targets.map((target) => {

        const x = clamp(target.position.x, -50, 50);
        const y = clamp(target.position.y, -50, 50);

        const screenX = x + 50;
        const screenY = y + 50;

        let colorClass = "bg-[#ff4d4d]";
        let shadowClass = "shadow-[0_0_10px_#ff4d4d]";

        const role = target.role?.toLowerCase();

        if (role === "demogorgon") {
          colorClass = "bg-red-600";
          shadowClass = "shadow-[0_0_15px_#dc2626]";
        } 
        else if (role === "security") {
          colorClass = "bg-yellow-500";
          shadowClass = "shadow-[0_0_15px_#eab308]";
        } 
        else if (role === "sheriff") {
          colorClass = "bg-blue-500";
          shadowClass = "shadow-[0_0_15px_#3b82f6]";
        }

        return (
          <div
            key={target.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
            style={{ left: `${screenX}%`, bottom: `${screenY}%` }}
          >
            <div className="relative group">

              {/* Radar Blip */}
              <div className={`w-3 h-3 rounded-full ${colorClass} ${shadowClass} animate-pulse`} />

              {/* Player Label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-black/80 px-1 py-0.5 border border-[#ff4d4d]/30 text-[8px] uppercase tracking-tighter flex flex-col items-center">
                <span className="font-bold">{target.name}</span>
                <span className="opacity-60">
                  [{Math.round(target.position.x)}, {Math.round(target.position.y)}]
                </span>
              </div>

              {/* Demogorgon Pulse */}
              {role === "demogorgon" && (
                <div className="absolute -inset-2 border border-red-500/50 rounded-full animate-ping"></div>
              )}

            </div>
          </div>
        );
      })}

      {/* Radar spin animation */}
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