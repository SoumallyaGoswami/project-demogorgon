import React, { useState, useEffect } from "react";
import socket from "../hooks/useSocket";
import Radar from "../components/Radar";

const Game = () => {

  const [radarTargets, setRadarTargets] = useState([]);
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });

  // Listen for detected players
  useEffect(() => {

    const handleDetectedPlayers = (players) => {
      setRadarTargets(players);
    };

    socket.on("detectedPlayers", handleDetectedPlayers);

    return () => {
      socket.off("detectedPlayers", handleDetectedPlayers);
    };

  }, []);

  // Simulated movement
  useEffect(() => {

    const moveInterval = setInterval(() => {

      const nextX = Math.floor(Math.random() * 101) - 50;
      const nextY = Math.floor(Math.random() * 101) - 50;

      setMyPos({ x: nextX, y: nextY });

      socket.emit("updatePosition", {
        x: nextX,
        y: nextY
      });

    }, 1000);

    return () => clearInterval(moveInterval);

  }, []);

  return (
    <div className="min-h-screen bg-black text-[#ff4d4d] font-mono relative overflow-hidden flex items-center justify-center p-4 md:p-8">

      {/* CRT Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.05]"
        style={{
          background:
            "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))",
          backgroundSize: "100% 3px, 3px 100%"
        }}
      />

      <div className="relative z-10 w-full max-w-6xl aspect-video border-4 border-[#ff4d4d]/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,0,0,0.1)] flex flex-col">

        {/* Header */}
        <div className="border-b-2 border-[#ff4d4d]/30 px-6 py-3 flex justify-between items-center bg-[#111]">

          <div>
            <h1 className="text-2xl font-black tracking-[0.3em] italic uppercase">
              Radar_Tracking_System
            </h1>
            <span className="text-[10px] opacity-60 tracking-widest">
              HAWKINS NATIONAL LABORATORY | SECTOR 4
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs animate-pulse font-bold uppercase">
              System_Status: Active_Hunt
            </span>
            <span className="text-[10px] opacity-40 uppercase">
              Gate_Status: Sealed
            </span>
          </div>

        </div>

        <div className="flex-grow flex p-4 md:p-6 gap-6 overflow-hidden bg-black">

          {/* Radar */}
          <div className="flex-grow flex items-center justify-center border border-[#ff4d4d]/20 bg-[#050505]">

            <div className="w-[90%] md:w-[85%] aspect-square">
              <Radar targets={radarTargets} />
            </div>

          </div>

          {/* Sidebar */}
          <div className="hidden md:flex w-80 flex-col gap-4">

            {/* Position */}
            <div className="border border-[#ff4d4d]/40 bg-black/40 p-4">

              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                Subject Coordinates
              </p>

              <div className="flex justify-between font-bold text-lg">
                <span>X: {myPos.x}</span>
                <span>Y: {myPos.y}</span>
              </div>

            </div>

            {/* Detected Players */}
            <div className="flex-grow border border-[#ff4d4d]/20 bg-black/40 p-4 flex flex-col">

              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-4 pb-2 border-b border-[#ff4d4d]/10">
                Detected Signals
              </p>

              <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">

                {radarTargets.map((target) => (

                  <div
                    key={target.id}
                    className="flex items-center justify-between text-[10px] border-l-2 border-[#ff4d4d]/40 pl-3 py-1 hover:bg-[#ff4d4d]/5"
                  >

                    <div>
                      <span className="uppercase tracking-widest font-bold">
                        {target.name}
                      </span>

                      <div className="opacity-50 text-[8px]">
                        DIST: {target.distance?.toFixed(1)}M
                      </div>

                    </div>

                    <span className="opacity-70 italic uppercase text-[8px]">
                      {target.role}
                    </span>

                  </div>

                ))}

                {radarTargets.length === 0 && (
                  <div className="h-20 flex items-center justify-center opacity-20 italic text-xs uppercase tracking-widest">
                    Scanning Sector...
                  </div>
                )}

              </div>

            </div>

            {/* Threat */}
            <div className="border-2 border-red-600/50 bg-red-950/10 p-4 text-center">

              <p className="text-[10px] uppercase tracking-widest text-red-500 mb-1">
                Threat Assessment
              </p>

              <p className="text-xl font-black text-red-600 animate-pulse tracking-widest italic">
                CRITICAL_OMEGA
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="h-10 border-t-2 border-[#ff4d4d]/30 flex items-center px-6 justify-between bg-[#111] text-[8px] uppercase tracking-[0.4em] opacity-50">

          <span>Memory_Check: OK</span>
          <span>Data_Link: Encrypted</span>
          <span>© 1984 Hawkins National Lab</span>

        </div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 77, 77, 0.3);
        }
      `}</style>

    </div>
  );
};

export default Game;