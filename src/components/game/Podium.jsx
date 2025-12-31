import React from "react";
import { motion } from "framer-motion";
import { Trophy, Beer, ShieldAlert, BadgeCheck } from "lucide-react";

export default function Podium({ jogadores, onBackToLobby, onRestart }) {
  // 1. Agrupar por pontos (Lógica de Empate)
  // Cria um Map onde a chave é a pontuação e o valor é um array de jogadores
  const scoreMap = new Map();
  
  jogadores.forEach(p => {
    const pts = p.pontos || 0;
    if (!scoreMap.has(pts)) scoreMap.set(pts, []);
    scoreMap.get(pts).push(p);
  });

  // Ordena as pontuações (chaves) do maior para o menor
  const sortedScores = Array.from(scoreMap.keys()).sort((a, b) => b - a);

  // Define os grupos de jogadores para 1º, 2º e 3º lugar
  // Ex: podiumGroups[0] são os vencedores (pode ser 1 ou mais)
  const podiumGroups = sortedScores.map(score => scoreMap.get(score));

  // Achatando o resto para "Outros"
  // Se tivermos grupos para 1º, 2º e 3º, o resto (4º pontuação em diante) são "others"
  // Mas cuidado: se tivermos 5 pessoas em 1º lugar, não tem 2º nem 3º lugar "tradicional".
  // Lógica Olímpica: Se 2 pessoas ganham Ouro, ninguém ganha Prata. O próximo ganha Bronze.
  // Lógica Simplificada (Party Game): Mostramos os grupos de pontuação.
  // Vamos usar: Top 3 Pontuações Distintas.
  
  const place1 = podiumGroups[0] || [];
  const place2 = podiumGroups[1] || [];
  const place3 = podiumGroups[2] || [];

  // "Others" são todos da 4ª maior pontuação para baixo
  const othersGroups = podiumGroups.slice(3);
  const others = othersGroups.flat();

  // 2. Calcular Estatísticas para Prêmios (Restaurado)
  const getWinner = (statKey) => {
    let maxVal = -1;
    let winners = [];
    jogadores.forEach(j => {
      const val = j.stats?.[statKey] || 0;
      if (val > maxVal && val > 0) {
        maxVal = val;
        winners = [j];
      } else if (val === maxVal && val > 0) {
        winners.push(j);
      }
    });
    return winners;
  };

  const cachaceiros = getWinner('bebidas'); // Quem mais bebeu
  const arregoes = getWinner('recusou');    // Quem mais recusou (arregou)
  const santos = getWinner('euNunca');      // Quem mais disse "Eu Nunca" (opcional)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center animate-fade-in relative overflow-hidden">
      {/* Background Particles/Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent animate-spin-slow"></div>
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-8 z-10 drop-shadow-lg text-center">
        FIM DE JOGO!
      </h1>

      {/* PODIUM AREA */}
      <div className="flex flex-row items-end justify-center gap-2 md:gap-4 mb-12 w-full max-w-5xl z-10 px-4 mt-8 md:mt-16">
        
        {/* 2nd Place (Esquerda) */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className={`flex flex-col items-center order-1 w-1/3 ${place2.length === 0 ? 'invisible' : ''}`}
        >
            <div className={`flex flex-wrap justify-center -space-x-4 ${place2.length > 2 ? '-space-x-6' : ''}`}>
                {place2.map((p, i) => (
                    <div key={p.uid} className="flex flex-col items-center group relative transform transition-transform hover:z-20 hover:scale-110">
                         <div className="relative mb-2">
                             <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-gray-400 overflow-hidden shadow-lg relative z-0 bg-gray-800">
                                 {p.avatar?.startsWith("http") ? (
                                     <img src={p.avatar} alt={p.nome} className="w-full h-full object-cover" />
                                 ) : (
                                     <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xl md:text-2xl">{p.avatar}</div>
                                 )}
                             </div>
                             {/* Badge só no último ou ajustado (Se tem muitos, o badge pode poluir. Vamos deixar em todos) */}
                             <div className="absolute -bottom-2 -right-2 bg-gray-400 text-gray-900 font-bold w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-white z-10 shadow-md text-xs md:text-sm">2</div>
                         </div>
                         <span className="font-bold text-gray-300 text-[10px] md:text-sm text-center truncate w-20 md:w-32 block">{p.nome}</span>
                    </div>
                ))}
            </div>
            <span className="text-xs md:text-sm text-gray-400 mt-1 font-bold">{place2[0]?.pontos || 0} pts</span>
        </motion.div>

        {/* 1st Place (Centro - Vencedor) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`flex flex-col items-center order-2 w-1/3 mb-4 md:mb-0 relative ${place1.length === 0 ? 'invisible' : ''}`}
        >
            <div className="absolute -top-12 md:-top-16 text-yellow-400 animate-bounce z-20">
                <Trophy size={32} className="md:w-16 md:h-16" />
            </div>

            <div className={`flex flex-wrap justify-center -space-x-4 ${place1.length > 2 ? '-space-x-8' : ''}`}>
                {place1.map((p) => (
                   <div key={p.uid} className="flex flex-col items-center group relative transform transition-transform hover:z-30 hover:scale-110">
                        <div className="relative mb-2">
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-yellow-400 overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.5)] relative z-10 bg-gray-800">
                                {p.avatar?.startsWith("http") ? (
                                    <img src={p.avatar} alt={p.nome} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl md:text-5xl">{p.avatar}</div>
                                )}
                            </div>
                           <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 font-bold w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 border-white text-sm md:text-xl z-20 shadow-lg">1</div>
                        </div>
                         <span className="font-black text-xs md:text-xl text-yellow-400 drop-shadow-md text-center truncate w-24 md:w-40 block">{p.nome}</span>
                   </div>
                ))}
            </div>

            <span className="text-sm md:text-2xl text-yellow-200 font-bold mt-1">{place1[0]?.pontos || 0} pts</span>
            <span className="text-[10px] md:text-sm text-yellow-500/80 uppercase tracking-widest mt-1">
                {place1.length > 1 ? "Os Apocalípticos" : "O Apocalíptico"}
            </span>
        </motion.div>

        {/* 3rd Place (Direita) */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.7 }}
            className={`flex flex-col items-center order-3 w-1/3 ${place3.length === 0 ? 'invisible' : ''}`}
        >
            <div className={`flex flex-wrap justify-center -space-x-4 ${place3.length > 2 ? '-space-x-6' : ''}`}>
               {place3.map((p) => (
                   <div key={p.uid} className="flex flex-col items-center group relative transform transition-transform hover:z-20 hover:scale-110">
                        <div className="relative mb-2">
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-orange-700 overflow-hidden shadow-lg relative z-0 bg-gray-800">
                                {p.avatar?.startsWith("http") ? (
                                    <img src={p.avatar} alt={p.nome} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xl md:text-2xl">{p.avatar}</div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-orange-700 text-orange-100 font-bold w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-white z-10 shadow-md text-xs md:text-sm">3</div>
                        </div>
                        <span className="font-bold text-orange-300 text-[10px] md:text-sm text-center truncate w-20 md:w-32 block">{p.nome}</span>
                   </div>
               ))}
            </div>
            <span className="text-xs md:text-sm text-orange-400/80 mt-1 font-bold">{place3[0]?.pontos || 0} pts</span>
        </motion.div>

      </div>

      {/* AWARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl z-10 px-4">
        
        {/* Cachaceiro */}
        {cachaceiros.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
            className="bg-gray-800/80 backdrop-blur border border-purple-500/30 p-4 rounded-xl flex items-center gap-4 shadow-lg"
          >
            <div className="p-3 bg-purple-900/50 rounded-lg">
                <Beer className="text-purple-400 w-8 h-8" />
            </div>
            <div>
                <h3 className="font-bold text-purple-300 uppercase text-sm">O Cachaceiro 🍺</h3>
                <p className="font-black text-xl text-white">
                  {cachaceiros.map(c => c.nome).join(", ")}
                </p>
                <p className="text-xs text-gray-400">Bebeu {cachaceiros[0].stats?.bebidas || 0} vezes</p>
            </div>
          </motion.div>
        )}

        {/* Arregão */}
        {arregoes.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
              className="bg-gray-800/80 backdrop-blur border border-red-500/30 p-4 rounded-xl flex items-center gap-4 shadow-lg"
            >
              <div className="p-3 bg-red-900/50 rounded-lg">
                  <ShieldAlert className="text-red-400 w-8 h-8" />
              </div>
              <div>
                  <h3 className="font-bold text-red-300 uppercase text-sm">O Arregão 💩</h3>
                  <p className="font-black text-xl text-white">
                    {arregoes.map(c => c.nome).join(", ")}
                  </p>
                  <p className="text-xs text-gray-400">Recusou {arregoes[0].stats?.recusou || 0} desafios</p>
              </div>
            </motion.div>
        )}
      </div>

      {/* OTHER PLAYERS LIST */}
      {others.length > 0 && (
        <div className="w-full max-w-2xl mt-8 z-10 px-4">
            <h3 className="text-center font-bold text-gray-500 mb-4 uppercase tracking-widest text-xs">Menções Honrosas</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {others.map((p, idx) => (
                    <div key={p.uid} className="bg-gray-800/50 p-2 rounded flex items-center gap-2">
                        <span className="font-bold text-gray-500 text-sm">#{idx + 4}</span>
                        <span className="truncate text-sm font-medium">{p.nome}</span>
                        <span className="ml-auto text-xs text-gray-400">{p.pontos || 0} pts</span>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
        className="mt-12 z-10 flex flex-col md:flex-row gap-4"
      >
        <button 
            onClick={onRestart}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] flex items-center gap-2"
        >
            <Trophy size={20} />
            NOVO JOGO
            <span className="text-xs font-normal opacity-70 ml-1">(Reiniciar)</span>
        </button>

        <button 
            onClick={onBackToLobby}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all border border-white/20 flex items-center gap-2"
        >
            <BadgeCheck size={20} />
            VOLTAR AO LOBBY
            <span className="text-xs font-normal opacity-70 ml-1">(Zerar Tudo)</span>
        </button>
      </motion.div>

    </div>
  );
}
