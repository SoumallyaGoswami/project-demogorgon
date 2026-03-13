import React, { useState, useEffect } from "react";
import socket from "../hooks/useSocket";

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });

  // Listen for player positions from server
  useEffect(() => {
    socket.on("playerPositions", (data) => {
      setPlayers(data);
    });

    return () => {
      socket.off("playerPositions");
    };
  }, []);

  // Simulate movement and emit position every 500ms
  // Coordinates range: x: -50 -> 50, y: -50 -> 50
  useEffect(() => {
    const moveInterval = setInterval(() => {
      // Random movement within -50 to 50 range
      const nextX = Math.floor(Math.random() * 101) - 50;
      const nextY = Math.floor(Math.random() * 101) - 50;
      
      setMyPos({ x: nextX, y: nextY });
      socket.emit("updatePosition", { x: nextX, y: nextY });
    }, 500);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#ff4d4d] font-mono relative overflow-hidden flex items-center justify-center p-8">
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05]"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 3px, 3px 100%'
        }}
      ></div>

      {/* Terminal UI Frame */}
      <div className="relative z-10 w-full max-w-6xl aspect-video border-4 border-[#ff4d4d]/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,0,0,0.1)] flex flex-col">
        {/* Header */}
        <div className="border-b-2 border-[#ff4d4d]/30 px-6 py-3 flex justify-between items-center bg-[#111]">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-[0.3em] italic">RADAR_TRACKING_SYSTEM</h1>
            <span className="text-[10px] opacity-60 tracking-widest">HAWKINS NATIONAL LABORATORY | TOP SECRET</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-xs animate-pulse font-bold">SYSTEM_STATUS: ACTIVE_HUNT</span>
            <span className="text-[10px] opacity-40">SECTOR_GATE: SEALED</span>
          </div>
        </div>

        <div className="flex-grow relative flex items-center justify-center bg-black overflow-hidden">
          {/* Radar Background Rings */}
          <div className="absolute w-[80vh] h-[80vh] border border-[#ff4d4d]/20 rounded-full"></div>
          <div className="absolute w-[60vh] h-[60vh] border border-[#ff4d4d]/15 rounded-full"></div>
          <div className="absolute w-[40vh] h-[40vh] border border-[#ff4d4d]/10 rounded-full"></div>
          <div className="absolute w-[20vh] h-[20vh] border border-[#ff4d4d]/5 rounded-full"></div>
          
          {/* Radar Grid Axes */}
          <div className="absolute w-[80vh] h-[1px] bg-[#ff4d4d]/20"></div>
          <div className="absolute h-[80vh] w-[1px] bg-[#ff4d4d]/20"></div>

          {/* Radar Sweep Animation */}
          <div className="absolute w-[80vh] h-[80vh] rounded-full overflow-hidden pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 w-[100%] h-[100%] -translate-x-1/2 -translate-y-1/2 origin-center animate-[spin_4s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, rgba(255, 77, 77, 0.3) 0deg, transparent 90deg)'
              }}
            ></div>
          </div>

          {/* Radar Container for Players (100x100 virtual units) */}
          <div className="relative w-[80vh] h-[80vh]">
            {players.map((player) => {
              // Formula: screenPos = ((coord + 50) / 100) * 100%
              const screenX = ((player.position.x + 50)); 
              const screenY = ((player.position.y + 50));
              
              const isDemogorgon = player.role?.toLowerCase() === "demogorgon";
              const isSelf = player.id === socket.id;

              return (
                <div 
                  key={player.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-linear"
                  style={{ left: `${screenX}%`, bottom: `${screenY}%` }}
                >
                  <div className={`relative group`}>
                    {/* Blip */}
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_currentColor] animate-pulse 
                      ${isDemogorgon ? 'text-red-600 bg-red-600' : 'text-[#ff4d4d] bg-[#ff4d4d]'} 
                      ${isSelf ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`} 
                    />
                    
                    {/* Name Label */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-black/80 px-2 py-0.5 border border-[#ff4d4d]/30 text-[10px] tracking-tighter uppercase">
                      {player.name} {isSelf && "(YOU)"}
                    </div>

                    {/* Threat indicator for Demogorgon */}
                    {isDemogorgon && (
                      <div className="absolute -inset-4 border border-red-600/50 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Sidebar / Data Panels */}
        <div className="h-24 border-t-2 border-[#ff4d4d]/30 grid grid-cols-4 bg-[#111]">
          <div className="border-r border-[#ff4d4d]/20 p-4 flex flex-col justify-center">
            <span className="text-[8px] opacity-50 uppercase tracking-widest mb-1">Current Coordinates</span>
            <span className="text-sm font-bold tracking-widest">X: {myPos.x.toFixed(2)} | Y: {myPos.y.toFixed(2)}</span>
          </div>
          <div className="border-r border-[#ff4d4d]/20 p-4 flex flex-col justify-center">
            <span className="text-[8px] opacity-50 uppercase tracking-widest mb-1">Active Signals</span>
            <span className="text-sm font-bold tracking-widest">{players.length} SUBJECTS</span>
          </div>
          <div className="border-r border-[#ff4d4d]/20 p-4 flex flex-col justify-center">
            <span className="text-[8px] opacity-50 uppercase tracking-widest mb-1">Threat Level</span>
            <span className="text-sm font-bold tracking-widest text-red-500">CRITICAL_OMEGA</span>
          </div>
          <div className="p-4 flex items-center justify-end">
             <div className="w-16 h-8 border border-[#ff4d4d]/40 flex items-center justify-center opacity-50">
               <div className="w-2 h-2 bg-[#ff4d4d] rounded-full animate-ping"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;