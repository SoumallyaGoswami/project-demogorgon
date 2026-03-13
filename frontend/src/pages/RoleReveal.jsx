import React, { useState, useEffect } from 'react';
import socket from '../hooks/useSocket';

const RoleReveal = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Listen for role assignment from the server
    socket.on('roleAssigned', (data) => {
      setRole(data.role);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('roleAssigned');
    };
  }, []);

  const getRoleDisplay = () => {
    switch (role) {
      case 'demogorgon':
        return {
          title: 'YOU ARE THE DEMOGORGON',
          desc: 'OBJECTIVE: HUNT. CONSUME. DESTROY.',
          color: 'text-red-600',
          glow: 'shadow-[0_0_30px_rgba(220,38,38,0.8)]'
        };
      case 'sheriff':
        return {
          title: 'YOU ARE THE SHERIFF',
          desc: 'OBJECTIVE: PROTECT THE TOWN. FIND THE BREACH.',
          color: 'text-blue-500',
          glow: 'shadow-[0_0_30px_rgba(59,130,246,0.8)]'
        };
      case 'security':
        return {
          title: 'YOU ARE SECURITY',
          desc: 'OBJECTIVE: CONTAIN THE SUBJECTS. SECURE THE LAB.',
          color: 'text-yellow-500',
          glow: 'shadow-[0_0_30px_rgba(234,179,8,0.8)]'
        };
      default:
        return {
          title: 'INITIALIZING SECTOR...',
          desc: 'WAITING FOR CLEARANCE...',
          color: 'text-red-900',
          glow: ''
        };
    }
  };

  const roleInfo = getRoleDisplay();

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono flex flex-col items-center justify-center p-4 bg-[radial-gradient(circle,_#1a0000_1px,_transparent_1px)] bg-[size:20px_20px] relative overflow-hidden">
      {/* Scanline & CRT Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
      
      {/* Visual Glitch/Radar Effect */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-center">
        <div className="w-full border-t-2 border-b-2 border-red-900/50 py-2 mb-12 flex justify-between px-4 text-[10px] tracking-widest uppercase">
          <span>Encryption: Classified</span>
          <span>Hawkins Lab // Internal Use Only</span>
          <span>Access Level: 5</span>
        </div>

        {/* The Reveal */}
        <div className={`text-center transition-all duration-1000 ${role ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
          <p className="text-red-900 text-sm tracking-[0.5em] mb-4 uppercase">Analysis Complete</p>
          <h1 className={`text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter ${roleInfo.color} drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]`}>
            {roleInfo.title}
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600 to-transparent mb-6"></div>
          <p className="text-xl md:text-2xl font-light tracking-widest text-red-400 mb-12">
            {roleInfo.desc}
          </p>
        </div>

        {/* Terminal Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
           <div className="bg-red-900/10 border border-red-900/40 p-4 rounded backdrop-blur-sm">
              <span className="block text-[10px] text-red-700 uppercase mb-2">Location</span>
              <span className="text-sm">UPSIDE DOWN BORDER</span>
           </div>
           <div className="bg-red-900/10 border border-red-900/40 p-4 rounded backdrop-blur-sm">
              <span className="block text-[10px] text-red-700 uppercase mb-2">Status</span>
              <span className="text-sm animate-pulse">ACTIVE HUNT</span>
           </div>
           <div className="bg-red-900/10 border border-red-900/40 p-4 rounded backdrop-blur-sm">
              <span className="block text-[10px] text-red-700 uppercase mb-2">Threat Level</span>
              <span className="text-sm text-red-600">CRITICAL</span>
           </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => window.location.href = '/game'}
          disabled={!role}
          className="group relative px-12 py-4 bg-red-700 hover:bg-red-600 text-black font-black uppercase tracking-[0.3em] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="relative z-10">Continue to Sector</span>
          <div className="absolute inset-0 bg-red-500 blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
        </button>

        <footer className="mt-20 text-[10px] text-red-900/60 flex space-x-8 uppercase">
          <span>Sys_ID: 11-B</span>
          <span>Auth_Token: ********</span>
          <span>Time: 02:44 AM</span>
        </footer>
      </div>
    </div>
  );
};

export default RoleReveal;
