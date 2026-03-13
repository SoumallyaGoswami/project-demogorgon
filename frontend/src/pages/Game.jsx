import React, { useState, useEffect } from "react";
import socket from "../hooks/useSocket";
import Radar from "../components/Radar";

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [radarTargets, setRadarTargets] = useState([]);
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });

  useEffect(() => {

    const handlePlayers = (data) => {
      setPlayers(data);
    };

    const handleRadar = (targets) => {
      setRadarTargets(targets);
    };

    socket.on("playerPositions", handlePlayers);
    socket.on("radarTargets", handleRadar);

    return () => {
      socket.off("playerPositions", handlePlayers);
      socket.off("radarTargets", handleRadar);
    };

  }, []);

  useEffect(() => {

    const moveInterval = setInterval(() => {

      setMyPos((prev) => {

        let nextX = prev.x + (Math.random() * 4 - 2);
        let nextY = prev.y + (Math.random() * 4 - 2);

        nextX = Math.max(-50, Math.min(50, nextX));
        nextY = Math.max(-50, Math.min(50, nextY));

        const newPos = {
          x: Math.round(nextX),
          y: Math.round(nextY)
        };

        socket.emit("updatePosition", newPos);

        return newPos;

      });

    }, 500);

    return () => clearInterval(moveInterval);

  }, []);

  return (
    <div className="min-h-screen bg-black text-[#ff4d4d] font-mono relative overflow-hidden flex items-center justify-center p-4">

      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05]"
        style={{
          background:
            "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))",
          backgroundSize: "100% 3px, 3px 100%"
        }}
      ></div>

      <div className="relative z-10 w-full max-w-6xl aspect-video border-4 border-[#ff4d4d]/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,0,0,0.1)] flex flex-col">

        <div className="border-b-2 border-[#ff4d4d]/30 px-6 py-3 flex justify-between items-center bg-[#111]">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-[0.3em] italic uppercase">
              Radar_Tracking_System
            </h1>
            <span className="text-[10px] opacity-60 tracking-widest">
              HAWKINS NATIONAL LABORATORY | SECTOR 4
            </span>
          </div>

          <div className="text-right flex flex-col">
            <span className="text-xs animate-pulse font-bold uppercase">
              System_Status: Active_Hunt
            </span>
            <span className="text-[10px] opacity-40 uppercase">
              Gate_Status: Sealed
            </span>
          </div>
        </div>

        <div className="flex-grow flex p-6 gap-6 overflow-hidden bg-black">

          <div className="flex-grow relative flex items-center justify-center border border-[#ff4d4d]/20 bg-[#050505]">
            <div className="w-[85%] aspect-square">
              <Radar targets={radarTargets} />
            </div>
          </div>

          <div className="w-80 flex flex-col gap-4">

            <div className="border border-[#ff4d4d]/40 bg-black/40 p-4 relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ff4d4d]/60"></div>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                Subject Coordinates
              </p>

              <div className="flex justify-between font-bold text-lg">
                <span>X: {myPos.x}</span>
                <span>Y: {myPos.y}</span>
              </div>
            </div>

            <div className="flex-grow border border-[#ff4d4d]/20 bg-black/40 p-4 overflow-hidden flex flex-col">

              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-4 pb-2 border-b border-[#ff4d4d]/10">
                Active Signals
              </p>

              <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">

                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between text-[10px] border-l-2 border-[#ff4d4d]/40 pl-3 py-1 hover:bg-[#ff4d4d]/5 transition-colors"
                  >
                    <span className="uppercase tracking-widest truncate max-w-[120px]">
                      {player.name}
                    </span>
                    <span className="opacity-50 italic">STABLE</span>
                  </div>
                ))}

              </div>

            </div>

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

        <div className="h-10 border-t-2 border-[#ff4d4d]/30 flex items-center px-6 justify-between bg-[#111] text-[8px] uppercase tracking-[0.4em] opacity-50">
          <span>Memory_Check: OK</span>
          <span>Data_Link: Encrypted</span>
          <span>© 1984 Hawkins National Lab</span>
        </div>

      </div>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar { width:2px; }
          .custom-scrollbar::-webkit-scrollbar-track { background:rgba(255,77,77,0.05); }
          .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(255,77,77,0.3); }
        `}
      </style>

    </div>
  );
};

export default Game;