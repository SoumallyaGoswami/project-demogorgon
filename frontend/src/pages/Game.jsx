import React, { useState, useEffect } from "react";
import socket from "../hooks/useSocket";
import Radar from "../components/Radar";

const Game = () => {

  const [radarTargets, setRadarTargets] = useState([]);
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });
  const [isCaptured, setIsCaptured] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // SOCKET LISTENERS
  useEffect(() => {

    const handleDetectedPlayers = (players) => {
      if (!isCaptured) {
        setRadarTargets(players);
      }
    };

    const handleCaptured = () => {
      setIsCaptured(true);
      setRadarTargets([]);
    };

    const handlePlayerCaptured = (data) => {
      const message = `${data.name || "A SUBJECT"} WAS CAPTURED`;
      setNotifications((prev) => [message, ...prev].slice(0, 5));
    };

    socket.on("detectedPlayers", handleDetectedPlayers);
    socket.on("captured", handleCaptured);
    socket.on("playerCaptured", handlePlayerCaptured);

    return () => {
      socket.off("detectedPlayers", handleDetectedPlayers);
      socket.off("captured", handleCaptured);
      socket.off("playerCaptured", handlePlayerCaptured);
    };

  }, []);

  // MOVEMENT SIMULATION
  useEffect(() => {

    if (isCaptured) return;

    const moveInterval = setInterval(() => {

      setMyPos((prev) => {

        const nextX = Math.max(-50, Math.min(50, prev.x + (Math.random() * 10 - 5)));
        const nextY = Math.max(-50, Math.min(50, prev.y + (Math.random() * 10 - 5)));

        const position = { x: nextX, y: nextY };

        socket.emit("updatePosition", position);

        return position;

      });

    }, 500);

    return () => clearInterval(moveInterval);

  }, [isCaptured]);

  return (
    <div className="min-h-screen bg-black text-[#ff4d4d] font-mono relative overflow-hidden flex items-center justify-center p-4 md:p-8">

      {/* CRT Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.05]"
        style={{
          background:
            "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))",
          backgroundSize: "100% 3px, 3px 100%"
        }}
      />

      <div className="relative z-10 w-full max-w-6xl aspect-video border-4 border-[#ff4d4d]/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,0,0,0.1)] flex flex-col">

        {/* HEADER */}
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
            <span className={`text-xs font-bold uppercase ${isCaptured ? "text-red-600 animate-bounce" : "animate-pulse text-[#ff4d4d]"}`}>
              System_Status: {isCaptured ? "SUBJECT_LOST" : "Active_Hunt"}
            </span>
            <span className="text-[10px] opacity-40 uppercase">
              Gate_Status: Sealed
            </span>
          </div>

        </div>

        <div className="flex-grow flex p-4 md:p-6 gap-6 overflow-hidden bg-black relative">

          {/* RADAR */}
          <div className="flex-grow relative flex items-center justify-center border border-[#ff4d4d]/20 bg-[#050505]">

            <div className={`w-[90%] md:w-[85%] aspect-square transition-opacity duration-1000 ${isCaptured ? "opacity-20 grayscale" : "opacity-100"}`}>
              <Radar targets={radarTargets} />
            </div>

            {/* CAPTURE OVERLAY */}
            {isCaptured && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-red-950/40 backdrop-blur-md animate-pulse">

                <div className="text-center p-8 border-4 border-red-600 bg-black/90 shadow-[0_0_50px_rgba(220,38,38,0.5)]">

                  <h2 className="text-4xl md:text-6xl font-black text-red-600 tracking-tighter mb-4">
                    YOU WERE CAPTURED
                  </h2>

                  <p className="text-xl md:text-2xl font-bold text-red-500 uppercase tracking-[0.3em] italic">
                    BY THE DEMOGORGON
                  </p>

                  <div className="mt-8 pt-4 border-t border-red-600/30">
                    <p className="text-xs text-red-400/60 uppercase animate-pulse">
                      Connection Interrupted... Signal Lost
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* SIDEBAR */}
          <div className="hidden md:flex w-80 flex-col gap-4">

            {/* POSITION PANEL */}
            <div className={`border border-[#ff4d4d]/40 bg-black/40 p-4 relative transition-opacity ${isCaptured ? "opacity-30" : "opacity-100"}`}>

              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                Subject Coordinates
              </p>

              <div className="flex justify-between font-bold text-lg">
                <span>X: {isCaptured ? "???" : myPos.x.toFixed(1)}</span>
                <span>Y: {isCaptured ? "???" : myPos.y.toFixed(1)}</span>
              </div>

            </div>

            {/* LOGS PANEL */}
            <div className="flex-grow border border-[#ff4d4d]/20 bg-black/40 p-4 overflow-hidden flex flex-col">

              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-4 pb-2 border-b border-[#ff4d4d]/10">
                System Logs
              </p>

              <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">

                {notifications.map((msg, idx) => (
                  <div key={idx} className="text-[10px] border-l-2 border-red-600 pl-3 py-1 bg-red-600/5 text-red-500 font-bold">
                    {msg}
                  </div>
                ))}

                {!isCaptured && radarTargets.map((target) => (
                  <div key={target.id} className="flex items-center justify-between text-[10px] border-l-2 border-[#ff4d4d]/40 pl-3 py-1 hover:bg-[#ff4d4d]/5 transition-colors">

                    <div className="flex flex-col">
                      <span className="uppercase tracking-widest truncate max-w-[120px] font-bold">
                        {target.name}
                      </span>
                      <span className="opacity-50 text-[8px]">
                        DIST: {target.distance?.toFixed(1)}M
                      </span>
                    </div>

                    <span className="opacity-70 italic uppercase text-[8px]">
                      {target.role}
                    </span>

                  </div>
                ))}

                {!isCaptured && radarTargets.length === 0 && (
                  <div className="h-20 flex items-center justify-center opacity-20 italic text-xs uppercase tracking-widest">
                    Scanning Sector...
                  </div>
                )}

              </div>

            </div>

            {/* THREAT PANEL */}
            <div className={`border-2 border-red-600/50 bg-red-950/10 p-4 text-center transition-all ${isCaptured ? "bg-red-600 text-white border-white animate-pulse" : ""}`}>

              <p className="text-[10px] uppercase tracking-widest text-red-500 mb-1">
                Threat Assessment
              </p>

              <p className="text-xl font-black text-red-600 tracking-widest italic">
                {isCaptured ? "FATAL_ERROR" : "CRITICAL_OMEGA"}
              </p>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="h-10 border-t-2 border-[#ff4d4d]/30 flex items-center px-6 justify-between bg-[#111] text-[8px] uppercase tracking-[0.4em] opacity-50">

          <span>Memory_Check: {isCaptured ? "FAILED" : "OK"}</span>
          <span>Data_Link: {isCaptured ? "LOST" : "Encrypted"}</span>
          <span>© 1984 Hawkins National Lab</span>

        </div>

      </div>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 77, 77, 0.3);
          }
        `}
      </style>

    </div>
  );
};

export default Game;