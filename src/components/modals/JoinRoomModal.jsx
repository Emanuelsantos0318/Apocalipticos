import React from "react";
import { useState, useEffect } from "react";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

// Estilos curados que combinam mais com o jogo
const AVATAR_STYLES = [
  { id: "bottts", label: "Robôs" },
  { id: "adventurer", label: "Aventureiros" },
  { id: "lorelei", label: "Cartoon" },
  { id: "avataaars", label: "Pessoas" },
  { id: "fun-emoji", label: "Emojis" },
];

export default function JoinRoomModal({ isOpen, onClose, onJoin }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setNascimento] = useState("");
  const [chave, setChave] = useState("");
  const [erro, setErro] = useState("");
  
  // Avatar states
  const [avatarSeed, setAvatarSeed] = useState("");
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setNome("");
      setNascimento("");
      setChave("");
      setErro("");
      // Gera um seed aleatório inicial
      setAvatarSeed(Math.random().toString(36).substring(7));
    }
  }, [isOpen]);

  const currentStyle = AVATAR_STYLES[currentStyleIndex];
  const avatarUrl = `https://api.dicebear.com/7.x/${currentStyle.id}/svg?seed=${avatarSeed}`;

  const handleRandomize = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const handlePrevStyle = () => {
    setCurrentStyleIndex((prev) => (prev === 0 ? AVATAR_STYLES.length - 1 : prev - 1));
  };

  const handleNextStyle = () => {
    setCurrentStyleIndex((prev) => (prev === AVATAR_STYLES.length - 1 ? 0 : prev + 1));
  };

  const handleJoin = () => {
    if (!nome || !dataNascimento || !chave) {
      setErro("Preencha todos os campos.");
      return;
    }

    const jogador = {
      nome,
      dataNascimento,
      avatar: avatarUrl,
      chave: chave.trim().toUpperCase(),
    };

    localStorage.setItem("playerName", nome);
    localStorage.setItem("birthDate", dataNascimento);
    localStorage.setItem("avatar", avatarUrl);

    setErro("");
    onJoin(jogador);
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-apocal-cinzaEmer p-6 rounded-xl w-full max-w-md shadow-2xl border border-apocal-laranjaClaro/30 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Entrar na Sala</h2>

        {erro && (
          <div className="bg-red-500/10 border border-red-500/50 rounded p-2 mb-4">
             <p className="text-red-400 text-sm text-center">{erro}</p>
          </div>
        )}

        <div className="space-y-4">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <label className="text-sm font-medium text-gray-300">Seu Avatar</label>
            
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-700/50 border-2 border-apocal-laranjaClaro/50 overflow-hidden shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                <img 
                  src={avatarUrl} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={handleRandomize}
                className="absolute bottom-0 right-0 p-2 bg-apocal-laranjaEscuro rounded-full hover:bg-orange-500 transition-colors shadow-lg border border-white/20"
                title="Novo visual"
              >
                <RefreshCw size={16} className="text-white" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
              <button onClick={handlePrevStyle} className="p-1 hover:text-apocal-laranjaClaro transition-colors text-gray-400">
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-300 min-w-[80px] text-center select-none">
                {currentStyle.label}
              </span>
              <button onClick={handleNextStyle} className="p-1 hover:text-apocal-laranjaClaro transition-colors text-gray-400">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Apelido</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-apocal-laranjaClaro focus:ring-1 focus:ring-apocal-laranjaClaro placeholder-gray-500"
              placeholder="Como quer ser chamado?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Data de nascimento
            </label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setNascimento(e.target.value)}
              className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-apocal-laranjaClaro focus:ring-1 focus:ring-apocal-laranjaClaro [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Código da Sala
            </label>
            <input
              type="text"
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-center tracking-widest uppercase font-mono text-lg focus:outline-none focus:border-apocal-laranjaClaro focus:ring-1 focus:ring-apocal-laranjaClaro placeholder-gray-600"
              placeholder="ABCDE"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleJoin}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-500 font-medium shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
