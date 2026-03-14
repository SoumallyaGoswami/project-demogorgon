import React, { useState, useEffect } from "react";
import socket from "../hooks/useSocket";
import Radar from "../components/Radar";

const Game = () => {

  const [playerRole, setPlayerRole] = useState(null);
  const [radarTargets, setRadarTargets] = useState([]);
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });
  const [isCaptured, setIsCaptured] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasBullet, setHasBullet] = useState(false);

  // 20 SECOND TIMER
  const [timeLeft, setTimeLeft] = useState(20);

  const [gameWinner, setGameWinner] = useState(null);

  /*
  TIMER SYSTEM
  */
  useEffect(() => {

    if (gameWinner) return;

    const interval = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {
          clearInterval(interval);

          socket.emit("timeUp");

          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [gameWinner]);

  /*
  SOCKET LISTENERS
  */
  useEffect(() => {

    const handleRoleAssigned = (data) => {

      if (!data || !data.role) return;

      console.log("Role assigned:", data.role);

      setPlayerRole(data.role);

      if (data.role === "sheriff") {
        setHasBullet(true);
      } else {
        setHasBullet(false);
      }

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

    const handleGameOver = (data) => {

      console.log("GAME OVER:", data);

      if (!data || !data.winner) return;

      setGameWinner(data.winner);

    };

    socket.on("roleAssigned", handleRoleAssigned);
    socket.on("detectedPlayers", handleDetectedPlayers);
    socket.on("captured", handleCaptured);
    socket.on("playerCaptured", handlePlayerCaptured);
    socket.on("gameOver", handleGameOver);

    return () => {

      socket.off("roleAssigned", handleRoleAssigned);
      socket.off("detectedPlayers", handleDetectedPlayers);
      socket.off("captured", handleCaptured);
      socket.off("playerCaptured", handlePlayerCaptured);
      socket.off("gameOver", handleGameOver);

    };

  }, [isCaptured]);

  /*
  MOVEMENT SIMULATION
  */
  useEffect(() => {

    if (isCaptured || gameWinner) return;

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

  }, [isCaptured, gameWinner]);

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

      {/* GAME OVER SCREEN */}
      {gameWinner && (

        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">

          <div className="text-center">

            <h1 className="text-6xl text-red-600 font-black mb-6">
              GAME OVER
            </h1>

            <h2 className="text-3xl text-white">

              {gameWinner === "demogorgon"
                ? "DEMOGORGON WINS"
                : "HUMANS WIN"}

            </h2>

          </div>

        </div>

      )}

      {/* CRT Scanline */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.05]"
        style={{
          background:
            "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))",
          backgroundSize: "100% 3px, 3px 100%"
        }}
      />

      <div className="relative z-20 w-full max-w-6xl aspect-video border-4 border-[#ff4d4d]/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,0,0,0.1)] flex flex-col">

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

            <div className="text-xs mt-1">
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2,"0")}
            </div>

          </div>

        </div>

        <div className="flex-grow flex p-4 md:p-6 gap-6 overflow-hidden bg-black relative">

          {/* RADAR */}
          <div className="flex-grow relative flex items-center justify-center border border-[#ff4d4d]/20 bg-[#050505]">

            <div className={`w-[90%] md:w-[85%] aspect-square transition-opacity duration-1000 ${isCaptured ? "opacity-20 grayscale" : ""}`}>
              <Radar targets={radarTargets} />
            </div>

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

    </div>
  );

};

export default Game;