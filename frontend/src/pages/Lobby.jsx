import React from "react";
import socket from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [name, setName] = React.useState("");
  const [players, setPlayers] = React.useState([]);

  const navigate = useNavigate();

  React.useEffect(() => {

    const handlePlayerListUpdate = (updatedPlayers) => {
      setPlayers(updatedPlayers);
    };

    // 🔥 THIS IS THE IMPORTANT FIX
    const handleRoleAssigned = (data) => {
      if (data && data.role) {
        console.log("ROLE RECEIVED:", data.role);

        // Navigate immediately with role
        navigate("/role", {
          state: { role: data.role }
        });
      }
    };

    socket.on("playerListUpdate", handlePlayerListUpdate);
    socket.on("roleAssigned", handleRoleAssigned);

    return () => {
      socket.off("playerListUpdate", handlePlayerListUpdate);
      socket.off("roleAssigned", handleRoleAssigned);
    };

  }, [navigate]);

  const handleJoinLobby = () => {
    if (name.trim()) {
      socket.emit("joinLobby", { name });
    }
  };

  const handleStartGame = () => {
    socket.emit("startGame");
  };

  return (
    <div className="min-h-screen bg-black text-[#ff4d4d] font-mono relative overflow-hidden flex items-center justify-center p-4">

      {/* Radar Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#ff4d4d 1px, transparent 1px), linear-gradient(90deg,#ff4d4d 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Radar Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] border border-[#ff4d4d] rounded-full opacity-10 animate-ping"></div>
        <div className="w-[400px] h-[400px] border border-[#ff4d4d] rounded-full opacity-20 animate-pulse"></div>
      </div>

      {/* Panel */}
      <div className="relative z-10 w-full max-w-4xl bg-[#1a1a1a] border-2 border-[#ff4d4d] shadow-[0_0_20px_rgba(255,77,77,0.3)] p-8">

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold tracking-[0.2em] mb-2 drop-shadow-[0_0_10px_rgba(255,77,77,0.8)]">
            PROJECT DEMOGORGON
          </h1>
          <p className="text-sm tracking-[0.5em] uppercase opacity-80">
            Hawkins Lab Security System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            <label className="text-xs uppercase tracking-[0.2em]">
              Input Subject ID
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER_NAME"
              className="w-full bg-black border border-[#ff4d4d]/50 p-4 text-xl outline-none uppercase"
            />

            <button
              onClick={handleJoinLobby}
              className="w-full py-4 border-2 border-[#ff4d4d] hover:bg-[#ff4d4d] hover:text-black transition-all text-xl font-bold uppercase"
            >
              Join Lobby
            </button>

          </div>

          {/* PLAYER LIST */}
          <div>

            <div className="flex justify-between mb-4">
              <span>Active Nodes</span>
              <span>{players.length}/12</span>
            </div>

            <div className="space-y-2">

              {players.length > 0 ? (
                players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 border border-[#ff4d4d]/30 p-3"
                  >
                    <div className="w-2 h-2 bg-[#ff4d4d] rounded-full"></div>
                    <span>{player.name}</span>
                  </div>
                ))
              ) : (
                <p className="opacity-50">Waiting for players...</p>
              )}

            </div>

            <button
              disabled={players.length < 2}
              onClick={handleStartGame}
              className="w-full mt-8 py-4 border-2 border-[#ff4d4d] text-xl font-bold uppercase disabled:opacity-30"
            >
              Start Hunt
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Lobby;