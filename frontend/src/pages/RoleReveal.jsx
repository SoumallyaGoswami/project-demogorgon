import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RoleReveal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 ROLE COMES FROM LOBBY NAVIGATION
  const role = location.state?.role;

  const roleConfigs = {
    demogorgon: {
      text: "YOU ARE THE DEMOGORGON",
      color: "text-[#ff0000]",
      dropShadow: "drop-shadow-[0_0_15px_rgba(255,0,0,1)]",
    },
    sheriff: {
      text: "YOU ARE THE SHERIFF",
      color: "text-[#4da6ff]",
      dropShadow: "drop-shadow-[0_0_15px_rgba(77,166,255,1)]",
    },
    security: {
      text: "YOU ARE SECURITY",
      color: "text-[#ffd24d]",
      dropShadow: "drop-shadow-[0_0_15px_rgba(255,210,77,1)]",
    },
    unknown: {
      text: "ROLE UNAVAILABLE",
      color: "text-[#ff4d4d]",
      dropShadow: "drop-shadow-[0_0_15px_rgba(255,77,77,1)]",
    },
  };

  const normalizedRole = role ? role.toLowerCase() : null;
  const currentRole =
    (normalizedRole && roleConfigs[normalizedRole]) || roleConfigs.unknown;

  // Loading screen if role missing
  if (!role) {
    return (
      <div className="min-h-screen bg-black text-[#ff4d4d] font-mono flex items-center justify-center">
        <p className="text-xl tracking-[0.3em] uppercase animate-pulse">
          Processing role...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#ff4d4d] font-mono relative overflow-hidden flex flex-col items-center justify-center p-4">

      {/* Radar grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#ff4d4d 1px, transparent 1px), linear-gradient(90deg,#ff4d4d 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(500px) rotateX(60deg) translateY(-100px)",
          transformOrigin: "top"
        }}
      />

      {/* Radar sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 origin-center animate-[spin_4s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(255,77,77,0.15) 0deg, transparent 90deg)"
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-8 left-8 flex flex-col gap-1 opacity-60 text-[10px] uppercase tracking-[0.3em]">
        <span>Access Granted: Level 5 Clearance</span>
        <span className="animate-pulse">
          System_Time: {new Date().toISOString().replace("T", " ").slice(0, 19)}
        </span>
      </div>

      {/* Role reveal */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">

        <div className="text-center space-y-4 mb-16">

          <h2 className="text-xl tracking-[0.8em] uppercase opacity-80 border-b border-[#ff4d4d]/30 pb-4">
            Subject Identified
          </h2>

          <h1
            className={`text-6xl md:text-8xl font-black tracking-tighter ${currentRole.color} ${currentRole.dropShadow} uppercase`}
          >
            {currentRole.text}
          </h1>

        </div>

        {/* Info panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          {[
            { label: "Target Location", value: "Upside Down Border" },
            { label: "Operation Status", value: "Active Hunt" },
            { label: "Priority Index", value: "Threat Level: Critical" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-[#ff4d4d]/40 bg-black/40 p-6 backdrop-blur-sm"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2">
                {item.label}
              </p>
              <p className="text-lg font-bold uppercase tracking-widest">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Continue button */}
        <button
          onClick={() => navigate("/game")}
          className="px-12 py-5 bg-transparent border-2 border-[#ff4d4d] text-[#ff4d4d] font-black text-xl uppercase tracking-[0.5em] hover:bg-[#ff4d4d] hover:text-black transition-all"
        >
          Continue to Sector
        </button>

      </div>

    </div>
  );
};

export default RoleReveal;