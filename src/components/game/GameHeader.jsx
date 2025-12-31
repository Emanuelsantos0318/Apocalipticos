// GameHeader.jsx
import React from "react";
import { LogOut, Trophy } from "lucide-react";
import { GAME_MODES } from "../../constants/constants";

export const GameHeader = ({ codigo, modo, currentPlayer, isCurrentPlayer, jogadores, onLeave, isHost, onFinishGame }) => {
  const getModeLabel = (m) => {
    switch(m) {
      case GAME_MODES.NORMAL: return "Normal";
      case GAME_MODES.ADULTO: return "+18";
      case GAME_MODES.DIFICIL: return "Difícil";
      default: return m;
    }
  };

  const getModeColor = (m) => {
    switch(m) {
      case GAME_MODES.NORMAL: return "bg-blue-500";
      case GAME_MODES.ADULTO: return "bg-red-500";
      case GAME_MODES.DIFICIL: return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const nomeJogadorAtual = jogadores?.find(j => j.uid === currentPlayer)?.nome || "Desconhecido";

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Sala: {codigo}</h2>
          <div className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1 ${getModeColor(modo)} text-white`}>
            {getModeLabel(modo)}
          </div>
        </div>
        <div className="text-right flex items-center gap-4">
          <div>
            <p className="text-gray-400 text-sm">Vez de:</p>
            <p className={`font-bold ${isCurrentPlayer ? "text-green-400" : "text-white"}`}>
              {isCurrentPlayer ? "VOCÊ" : nomeJogadorAtual}
            </p>
          </div>
          
          {isHost && (
            <button
              onClick={onFinishGame}
              className="p-2 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 rounded-lg transition-colors border border-yellow-500/30"
              title="Encerrar Jogo (Pódio)"
            >
              <Trophy size={20} />
            </button>
          )}

          <button
            onClick={onLeave}
            className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
            title="Sair da Sala"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
      
      {/* Barra de Ferramentas Extra (ex: Música) */}
      <div className="flex justify-end mt-2">
         {onToggleMusic && (
            <button
              onClick={() => onToggleMusic("musicaJogo")}
              className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs"
              title={isMuted ? "Ativar Música" : "Silenciar Música"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? "Música Off" : "Música On"}
            </button>
         )}
      </div>
    </div>
  );
};