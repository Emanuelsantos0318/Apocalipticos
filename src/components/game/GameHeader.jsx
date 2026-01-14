// GameHeader.jsx
import React from "react";
import { LogOut, Trophy, Volume2, VolumeX, Skull } from "lucide-react";
import { GAME_MODES } from "../../constants/constants";

export const GameHeader = ({
  codigo,
  modo,
  currentPlayer,
  isCurrentPlayer,
  jogadores,
  onLeave,
  isHost,
  onFinishGame,
  onToggleMusic,
  isMuted,
  sala, // Added sala prop for activeEvents
}) => {
  const getModeLabel = (m) => {
    switch (m) {
      case GAME_MODES.NORMAL:
        return "Normal";
      case GAME_MODES.ADULTO:
        return "+18";
      case GAME_MODES.DIFICIL:
        return "Difícil";
      default:
        return m;
    }
  };

  const getModeColor = (m) => {
    switch (m) {
      case GAME_MODES.NORMAL:
        return "bg-blue-500";
      case GAME_MODES.ADULTO:
        return "bg-red-500";
      case GAME_MODES.DIFICIL:
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calcular ordem dos jogadores (Anterior, Atual, Próximo)
  const currentIndex = jogadores.findIndex((j) => j.uid === currentPlayer);
  const prevIndex = (currentIndex - 1 + jogadores.length) % jogadores.length;
  const nextIndex = (currentIndex + 1) % jogadores.length;

  const playerPrev = jogadores[prevIndex];
  const playerCurrent = jogadores[currentIndex];
  const playerNext = jogadores[nextIndex];

  // Helper para obter icone do role (hardcoded ou importado)
  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case "medico":
        return "🩺";
      case "assassino":
        return "🔪";
      case "estrategista":
        return "🧠";
      case "incendiaria":
        return "🔥";
      case "sobrevivente":
        return "☠️";
      default:
        return "👤";
    }
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-md p-4 rounded-xl mb-6 shadow-lg border border-gray-700/50">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* ESQUERDA: Info da Sala */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-wider font-mono">
                {codigo}
              </h2>
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getModeColor(
                  modo
                )} text-white shadow-sm`}
              >
                {getModeLabel(modo)}
              </div>
            </div>
          </div>

          {/* Mobile Actions (Host/Exit) - Visible only on small screens */}
          <div className="flex md:hidden gap-2">
            {isHost && (
              <button
                onClick={onFinishGame}
                className="p-2 bg-yellow-600/20 text-yellow-400 rounded-lg border border-yellow-500/30"
              >
                <Trophy size={18} />
              </button>
            )}
            <button
              onClick={onLeave}
              className="p-2 bg-red-600/20 text-red-400 rounded-lg"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* EVENTOS DO CAOS ATIVOS */}
        {sala?.activeEvents && sala.activeEvents.length > 0 && (
          <div className="flex gap-2 animate-pulse">
            {sala.activeEvents.map((ev, i) => {
              const ownerPlayer = jogadores.find((j) => j.uid === ev.owner);
              return (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-white ${
                    ev.color || "bg-red-600"
                  } flex items-center gap-2 shadow-lg border border-white/20`}
                  title={`${ev.name} (${ev.duration} rodadas) - Por: ${
                    ownerPlayer?.nome || "?"
                  }`}
                >
                  {ownerPlayer && (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/50">
                      {ownerPlayer.avatar?.startsWith("http") ? (
                        <img
                          src={ownerPlayer.avatar}
                          alt={ownerPlayer.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-[10px]">
                          {ownerPlayer.avatar}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{ev.icon}</span>
                      <span className="text-[10px] font-bold uppercase hidden md:inline">
                        {ev.name.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-[8px] opacity-80 text-center bg-black/20 rounded px-1">
                      {ev.duration} rodadas
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CENTRO: Fila de Turnos */}
        <div className="flex items-center justify-center gap-2 md:gap-4 flex-1">
          {/* Anterior (Pequeno) */}
          <div className="hidden md:flex flex-col items-center opacity-50 scale-75 grayscale">
            <div className="w-10 h-10 rounded-full bg-gray-700 mb-1 overflow-hidden">
              {playerPrev?.avatar && (
                <img
                  src={playerPrev.avatar}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="text-xs text-gray-400 truncate max-w-[60px]">
              {playerPrev?.nome}
            </span>
          </div>

          {/* ATUAL (Grande) */}
          <div className="flex flex-col items-center relative z-10">
            <div className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-1">
              Vez de
            </div>

            <div
              className={`relative p-1 rounded-full border-2 ${
                isCurrentPlayer
                  ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  : "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              }`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-800 overflow-hidden relative">
                {playerCurrent?.avatar && (
                  <img
                    src={playerCurrent.avatar}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Indicador de Dano/Critico */}
                {playerCurrent?.isCritical && (
                  <div className="absolute inset-0 bg-red-500/30 animate-pulse flex items-center justify-center">
                    <Skull size={32} className="text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
              {/* Role Icon Badge */}
              <div
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 rounded-full border border-gray-600 flex items-center justify-center text-lg shadow-md"
                title={playerCurrent?.role}
              >
                {getRoleIcon(playerCurrent?.role)}
              </div>
            </div>

            <div className="mt-2 text-center">
              <h3
                className={`font-bold text-lg leading-none ${
                  isCurrentPlayer ? "text-green-400" : "text-white"
                }`}
              >
                {isCurrentPlayer ? "VOCÊ" : playerCurrent?.nome}
              </h3>

              {/* HP Bar Mini */}
              {playerCurrent && (
                <div className="mt-1 w-24 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto relative group">
                  <div
                    className={`h-full ${
                      playerCurrent.hp <= 10
                        ? "bg-red-500"
                        : playerCurrent.hp <= 20
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    } transition-all duration-300`}
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          (playerCurrent.hp / (playerCurrent.maxHp || 30)) * 100
                        )
                      )}%`,
                    }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {playerCurrent.hp}/{playerCurrent.maxHp || 30}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Próximo (Pequeno) */}
          <div className="hidden md:flex flex-col items-center opacity-50 scale-75 grayscale">
            <div className="w-10 h-10 rounded-full bg-gray-700 mb-1 overflow-hidden">
              {playerNext?.avatar && (
                <img
                  src={playerNext.avatar}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="text-xs text-gray-400 truncate max-w-[60px]">
              {playerNext?.nome}
            </span>
          </div>
        </div>

        {/* DIREITA: Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isHost && (
            <button
              onClick={onFinishGame}
              className="p-2.5 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-500 rounded-xl transition-all hover:scale-105 border border-yellow-500/20"
              title="Encerrar Jogo (Pódio)"
            >
              <Trophy size={20} />
            </button>
          )}

          <button
            onClick={onLeave}
            className="p-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-500 rounded-xl transition-all hover:scale-105 border border-red-500/20"
            title="Sair da Sala"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
    </div>
  );
};
