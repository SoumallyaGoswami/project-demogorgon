import React, { useState, useEffect } from 'react';
import { socket } from '../hooks/useSocket';

const Lobby = () => {
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Listen for player list updates from the server
    socket.on('playerListUpdate', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('playerListUpdate');
    };
  }, []);

  const handleJoinLobby = () => {
    if (name.trim()) {
      socket.emit('joinLobby', { name });
      setIsJoined(true);
    }
  };

  const handleStartGame = () => {
    socket.emit('startGame');
  };

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono flex flex-col items-center justify-center p-4 bg-[radial-gradient(circle,_#1a0000_1px,_transparent_1px)] bg-[size:20px_20px] relative overflow-hidden">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
      
      {/* Radar Pulse Animation (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-900/20 rounded-full animate-pulse"></div>

      {/* Main Console Panel */}
      <div className="relative z-20 w-full max-w-2xl bg-gray-900/80 border-2 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] rounded-lg p-8 backdrop-blur-sm">
        <header className="text-center mb-8 border-b border-red-900 pb-4">
          <h1 className="text-5xl font-black tracking-widest text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] mb-2 uppercase">
            Project Demogorgon
          </h1>
          <p className="text-sm tracking-[0.3em] text-red-400/80 uppercase">
            Hawkins Lab Security System // Restricted Access
          </p>
        </header>

        {!isJoined ? (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-xs uppercase tracking-tighter text-red-500/60">Enter Subject Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="SUBJECT_ID_..."
                className="bg-black border border-red-900 p-4 text-red-500 placeholder-red-900 focus:outline-none focus:border-red-500 focus:shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all uppercase"
              />
            </div>
            <button
              onClick={handleJoinLobby}
              className="w-full bg-red-700 hover:bg-red-600 text-black font-bold py-4 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-all active:scale-[0.98]"
            >
              Initialize Connection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-black/50 border border-red-900 rounded p-4 h-64 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-4 border-b border-red-900/50 pb-2">
                <span className="text-xs uppercase text-red-500/60">Active Transmissions</span>
                <span className="text-xs uppercase text-red-500/60">{players.length} Subjects Detected</span>
              </div>
              <ul className="space-y-2">
                {players.map((player) => (
                  <li 
                    key={player.id} 
                    className="flex items-center space-x-3 p-2 border border-red-900/30 bg-red-900/5 animate-pulse"
                  >
                    <div className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_5px_rgba(220,38,38,1)]"></div>
                    <span className="uppercase tracking-widest text-sm">{player.name}</span>
                  </li>
                ))}
                {players.length === 0 && (
                  <li className="text-center py-10 text-red-900 uppercase animate-pulse">Waiting for subjects...</li>
                )}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="text-xs text-red-500/40 uppercase self-center">
                  Status: Secure<br/>
                  Location: Sector 4
               </div>
               <button
                onClick={handleStartGame}
                disabled={players.length < 1}
                className="bg-red-600 hover:bg-red-500 text-black font-bold py-3 uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Start Hunt
              </button>
            </div>
          </div>
        )}

        <footer className="mt-8 pt-4 border-t border-red-900 text-[10px] text-red-900 flex justify-between uppercase">
          <span>System: Active</span>
          <span>Encryption: AES-256</span>
          <span>H.L.C. V1.1983</span>
        </footer>
      </div>

      {/* Retro CRT Flicker Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-red-500/5 opacity-10 animate-pulse"></div>
    </div>
  );
};

export default Lobby;