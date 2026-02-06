import React from "react";
import toast from "react-hot-toast";
import { Zap } from "lucide-react";

export default function GameStartControls({
  isCurrentPlayer,
  currentPlayerName,
  gameActions,
  meuJogador,
  sala,
  onOpenAbilityModal,
}) {
  if (isCurrentPlayer) {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={gameActions.handleSortearCarta}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-xl font-bold animate-bounce shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105"
        >
          SORTEAR CARTA 🃏
        </button>

        {/* Botão de Habilidade de Classe */}
        {meuJogador?.role && (
          <button
            onClick={onOpenAbilityModal}
            className="flex items-center gap-2 px-6 py-2 bg-gray-800 border border-purple-500/30 hover:bg-gray-700 hover:border-purple-400 rounded-lg text-purple-300 font-bold transition-all text-sm uppercase tracking-wider"
          >
            <Zap size={16} />
            Usar Habilidade
          </button>
        )}

        {/* SLOTH SKIP BUTTON */}
        {sala?.activeEvents?.some((e) => e.id === "PREGUICA") && (
          <button
            onClick={async () => {
              toast("😴 Você escolheu dormir...", { icon: "💤" });
              await gameActions.handlePenalidade();
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-900/50 border border-blue-500/30 hover:bg-blue-800 rounded-lg text-blue-300 font-bold transition-all text-sm uppercase tracking-wider"
          >
            <span className="text-xl">💤</span>
            Pular (Beber)
          </button>
        )}
      </div>
    );
  }

  return (
    <p className="text-xl animate-pulse text-gray-300">
      Aguardando{" "}
      <span className="font-bold text-purple-400">
        {currentPlayerName || "o jogador"}
      </span>{" "}
      sortear uma carta...
    </p>
  );
}
