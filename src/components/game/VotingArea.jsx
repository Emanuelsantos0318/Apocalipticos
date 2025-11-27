import React, { useState } from "react";
import { motion } from "framer-motion";

export default function VotingArea({ jogadores, meuUid, onVote, votos, resultado }) {
  const [votoSelecionado, setVotoSelecionado] = useState(null);

  // Filtra para não mostrar o próprio jogador como opção de voto (opcional, mas comum em Amigos de Merda)
  // Mas em Amigos de Merda, às vezes você pode votar em si mesmo? Geralmente sim.
  // Vamos permitir votar em qualquer um por enquanto.
  const opcoes = jogadores;

  const handleVote = (targetUid) => {
    if (votoSelecionado) return; // Já votou
    setVotoSelecionado(targetUid);
    onVote(targetUid);
  };

  // Se já tiver resultado, mostra quem ganhou
  if (resultado) {
    const maisVotado = jogadores.find(j => j.uid === resultado.perdedor);
    return (
      <div className="text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          O mais votado foi:
        </h2>
        <div className="flex flex-col items-center">
          <div className="text-6xl mb-2">{maisVotado?.avatar || "🤡"}</div>
          <h3 className="text-xl font-bold">{maisVotado?.nome || "Desconhecido"}</h3>
          <p className="text-gray-400 mt-2">{resultado.totalVotos} votos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold text-center mb-6 text-purple-300">
        Quem é o mais provável?
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {opcoes.map((jogador) => {
          const isSelected = votoSelecionado === jogador.uid;
          const isMe = jogador.uid === meuUid;

          return (
            <motion.button
              key={jogador.uid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote(jogador.uid)}
              disabled={!!votoSelecionado}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${isSelected 
                  ? "border-purple-500 bg-purple-500/20" 
                  : "border-gray-700 bg-gray-800/50 hover:border-purple-500/50"}
                ${!!votoSelecionado && !isSelected ? "opacity-50 grayscale" : ""}
              `}
            >
              <div className="text-4xl mb-2">{jogador.avatar}</div>
              <div className="font-bold truncate">{isMe ? "Você" : jogador.nome}</div>
              
              {/* Indicador de voto (apenas visual para quem votou) */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-purple-500">
                  ✅
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {votoSelecionado && (
        <p className="text-center mt-6 text-gray-400 animate-pulse">
          Aguardando os outros jogadores...
        </p>
      )}
    </div>
  );
}
