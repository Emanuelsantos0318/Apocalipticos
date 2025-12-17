import React from "react";

export default function RankingJogadores({ jogadores, meuUid }) {
  // Ordenar jogadores por pontos (maior para menor)
  const jogadoresOrdenados = [...jogadores].sort((a, b) => (b.pontos || 0) - (a.pontos || 0));

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden shadow-xl w-full text-white">
      <div className="bg-gray-800/50 px-3 py-2 2xl:px-5 2xl:py-2 font-bold flex justify-between text-gray-300 border-b border-gray-700 text-xs 2xl:text-base">
        <span>Avatar</span>
        <span>Nome</span>
        <span>Pontos</span>
      </div>
      <div className="max-h-[50vh] 2xl:max-h-[60vh] overflow-y-auto custom-scrollbar">
        {jogadoresOrdenados.map((jogador, index) => (
          <div
            key={jogador.uid}
            className={`flex items-center justify-between px-3 py-2 2xl:px-5 2xl:py-2 border-b border-gray-700 transition-colors ${
              jogador.uid === meuUid 
                ? "bg-purple-900/40 hover:bg-purple-900/60" 
                : "hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-2 2xl:gap-4">
              <div className="relative">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-full bg-gray-700 flex items-center justify-center text-sm 2xl:text-xl overflow-hidden ring-1 2xl:ring-2 ring-gray-600">
                  {jogador.avatar && (jogador.avatar.startsWith("http") || jogador.avatar.includes("dicebear")) ? (
                    <img
                      src={jogador.avatar}
                      alt={jogador.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="leading-none">{jogador.avatar}</span>
                  )}
                </div>
                {index < 3 && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 2xl:w-5 2xl:h-5 rounded-full flex items-center justify-center text-[8px] 2xl:text-xs font-bold border border-gray-800 ${
                    index === 0 ? "bg-yellow-400 text-yellow-900" :
                    index === 1 ? "bg-gray-300 text-gray-900" :
                    "bg-amber-600 text-amber-100"
                  }`}>
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className={`font-medium text-xs 2xl:text-base ${jogador.uid === meuUid ? "text-purple-300" : "text-gray-200"}`}>
                  {jogador.uid === meuUid ? "Você" : jogador.nome}
                </span>
              </div>
            </div>
            <span className="font-bold text-sm 2xl:text-xl text-gray-100">{jogador.pontos || 0}</span>
          </div>
        ))}
        
        {jogadores.length === 0 && (
          <div className="p-4 2xl:p-8 text-center text-gray-500 text-xs 2xl:text-sm">
            Nenhum jogador pontuou ainda!
          </div>
        )}
      </div>
    </div>
  );
}
