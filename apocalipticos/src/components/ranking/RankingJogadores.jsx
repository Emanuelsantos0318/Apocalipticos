import React from "react";

export default function RankingJogadores({ jogadores, meuUid }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full max-w-md mx-auto mb-8 text-black">
      <div className="bg-gray-100 px-4 py-2 font-bold flex justify-between text-gray-700 border-b">
        <span>Avatar</span>
        <span>Nome</span>
        <span>Pontuação</span>
      </div>
      {jogadores.map((jogador) => (
        <div
          key={jogador.uid}
          className={`flex items-center justify-between px-4 py-2 border-b ${
            jogador.uid === meuUid ? "bg-apocal-amarelo font-bold" : "bg-white"
          }`}
        >
          <div className="w-10 h-10 rounded-full  flex items-center justify-center text-xl">
          {jogador.avatar.startsWith("http") ? (
            <img
              src={jogador.avatar}
              alt={jogador.nome}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl">{jogador.avatar}</span>
          )}
          </div>
          <span>{jogador.uid === meuUid ? "VOCÊ" : jogador.nome}</span>
          <span>{jogador.pontuacao || 0} pts</span>
        </div>
      ))}
    </div>
  );
}
