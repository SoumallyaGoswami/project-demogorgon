import React, { useState, useEffect } from "react";
import socket from "../hooks/useSocket";
import Radar from "../components/Radar";

const Game = () => {

  const [playerRole, setPlayerRole] = useState(
    localStorage.getItem("playerRole")
  );

  const [radarTargets, setRadarTargets] = useState([]);
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });
  const [isCaptured, setIsCaptured] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasBullet, setHasBullet] = useState(true);

  /*
  SOCKET LISTENERS
  */
  useEffect(() => {

    const handleRoleAssigned = (data) => {
      if (!data || !data.role) return;

      localStorage.setItem("playerRole", data.role);
      setPlayerRole(data.role);

      console.log("Role assigned:", data.role);
    };

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

    socket.on("roleAssigned", handleRoleAssigned);
    socket.on("detectedPlayers", handleDetectedPlayers);
    socket.on("captured", handleCaptured);
    socket.on("playerCaptured", handlePlayerCaptured);

    return () => {
      socket.off("roleAssigned", handleRoleAssigned);
      socket.off("detectedPlayers", handleDetectedPlayers);
      socket.off("captured", handleCaptured);
      socket.off("playerCaptured", handlePlayerCaptured);
    };

  }, [isCaptured]);

  /*
  MOVEMENT SIMULATION
  */
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

  /*
  SHERIFF FIRE WEAPON
  */
  const fireWeapon = () => {

    if (!hasBullet) return;
    if (playerRole !== "sheriff") return;

    socket.emit("sheriffShoot");

    setHasBullet(false);

    setNotifications((prev) => [
      "WEAPON DISCHARGED",
      ...prev
    ].slice(0, 5));

  };

  return (
    <div className="min-h-screen bg-black text-[#ff4d4d] font-mono relative overflow-hidden flex items-center justify-center p-4 md:p-8">

      {/* CRT Scanline */}
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

          <div>
            <h1 className="text-2xl font-black tracking-[0.3em] italic uppercase">
              Radar_Tracking_System
            </h1>
            <span className="text-[10px] opacity-60 tracking-widest">
              Hawkins National Laboratory
            </span>
          </div>

          <div className="text-right">
            <span className={`text-xs font-bold uppercase ${isCaptured ? "text-red-600 animate-bounce" : "animate-pulse text-[#ff4d4d]"}`}>
              System_Status: {isCaptured ? "SUBJECT_LOST" : "ACTIVE_HUNT"}
            </span>
          </div>

        </div>

        <div className="flex-grow flex p-4 md:p-6 gap-6 overflow-hidden bg-black relative">

          {/* RADAR */}
          <div className="flex-grow relative flex items-center justify-center border border-[#ff4d4d]/20 bg-[#050505]">

            <div className={`w-[90%] md:w-[85%] aspect-square transition-opacity duration-1000 ${isCaptured ? "opacity-20 grayscale" : ""}`}>
              <Radar targets={radarTargets} />
            </div>

            {isCaptured && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-950/40 backdrop-blur-md">

                <div className="text-center p-8 border-4 border-red-600 bg-black/90">

                  <h2 className="text-5xl font-black text-red-600">
                    YOU WERE CAPTURED
                  </h2>

                  <p className="text-xl text-red-500 uppercase mt-4">
                    BY THE DEMOGORGON
                  </p>

                </div>

              </div>
            )}

          </div>

          {/* SIDEBAR */}
          <div className="hidden md:flex w-80 flex-col gap-4">

            {/* POSITION */}
            <div className="border border-[#ff4d4d]/40 bg-black/40 p-4">

              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                Subject Coordinates
              </p>

              <div className="flex justify-between font-bold text-lg">
                <span>X: {isCaptured ? "???" : myPos.x.toFixed(1)}</span>
                <span>Y: {isCaptured ? "???" : myPos.y.toFixed(1)}</span>
              </div>

            </div>

            {/* LOGS */}
            <div className="flex-grow border border-[#ff4d4d]/20 bg-black/40 p-4 overflow-y-auto">

              {notifications.map((msg, idx) => (
                <div key={idx} className="text-[10px] border-l-2 border-red-600 pl-3 py-1 bg-red-600/5 text-red-500 font-bold mb-2">
                  {msg}
                </div>
              ))}

              {!isCaptured && radarTargets.map((target) => (
                <div key={target.id} className="flex justify-between text-[10px] border-l-2 border-[#ff4d4d]/40 pl-3 py-1">

                  <span className="font-bold uppercase">{target.name}</span>

                  <span>
                    {target.distance?.toFixed(1)}m
                  </span>

                </div>
              ))}

            </div>

            {/* SHERIFF WEAPON */}
            {playerRole === "sheriff" && (

              <div className={`border-2 p-4 ${hasBullet ? "border-red-600" : "border-[#ff4d4d]/20 opacity-40"}`}>

                <p className="text-[10px] uppercase tracking-widest text-center mb-3 opacity-70">
                  Weapon System
                </p>

                <button
                  disabled={!hasBullet || isCaptured}
                  onClick={fireWeapon}
                  className="w-full py-3 font-black tracking-[0.3em] uppercase bg-red-600 text-black hover:bg-red-500"
                >
                  {hasBullet ? "FIRE WEAPON" : "NO BULLET"}
                </button>

              </div>

            )}

          </div>

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