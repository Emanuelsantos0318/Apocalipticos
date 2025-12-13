import React from "react";
import { useState, useEffect } from "react";
import { ClipboardCopy, Check, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const modos = [
  { value: "normal", label: "Modo Normal" },
  { value: "mais18", label: "Modo +18" },
  { value: "dificil", label: "Modo Difícil" },
];

const AVATAR_STYLES = [
  { id: "bottts", label: "Robôs" },
  { id: "adventurer", label: "Aventureiros" },
  { id: "lorelei", label: "Cartoon" },
  { id: "avataaars", label: "Pessoas" },
  { id: "fun-emoji", label: "Emojis" },
];

function gerarCodigoSala() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from(
    { length: 5 },
    () => letras[Math.floor(Math.random() * letras.length)]
  ).join("");
}

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

export default function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const [roomCode, setRoomCode] = useState("");
  const [limiteJogadores, setLimiteJogadores] = useState(6);
  const [modo, setModo] = useState("normal");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [copied, setCopied] = useState(false);
  const discordLink = "https://discord.gg/rQDJht6Hg4";

  // Avatar states
  const [avatarSeed, setAvatarSeed] = useState("");
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setRoomCode(gerarCodigoSala());
      setLimiteJogadores(6);
      setModo("normal");
      setNome("");
      setDataNascimento("");
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const MODOS_VALIDOS = ["normal", "mais18", "dificil"];

  const handleSubmit = () => {
    if (!nome || !dataNascimento) {
      alert("Preencha seu nome e data de nascimento.");
      return;
    }

    const idade = calcularIdade(dataNascimento);
    if (idade < 18 && (modo === "mais18" || modo === "dificil")) {
      alert("Modos +18 e Difícil não estão disponíveis para menores de idade.");
      return;
    }

    if (!MODOS_VALIDOS.includes(modo)) {
      alert("Modo de jogo inválido.");
      return;
    }

    const roomData = {
      roomCode,
      limiteJogadores,
      modo,
      nomeAdmin: nome,
      dataNascimento,
      avatar: avatarUrl, // Salva o avatar gerado
      estado: "esperando",
      discordLink: discordLink,
    };
    onCreate(roomData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-apocal-cinzaEmer p-6 rounded-xl w-full max-w-md shadow-2xl border border-apocal-laranjaClaro/30 animate-in fade-in zoom-in duration-200 h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Criar Nova Sala</h2>

         {/* Avatar Section - Reused design */}
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">Seu nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-apocal-laranjaClaro focus:ring-1 focus:ring-apocal-laranjaClaro placeholder-gray-500"
            placeholder="Ex: Quenga Banguela"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Data de nascimento
          </label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-apocal-laranjaClaro focus:ring-1 focus:ring-apocal-laranjaClaro [color-scheme:dark]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Código da Sala
          </label>
          <div
            onClick={handleCopy}
            className="bg-gray-900/50 border border-gray-600 p-2.5 rounded-lg text-center font-mono text-lg text-white cursor-pointer hover:bg-gray-800 flex items-center justify-center gap-2 transition"
            title="Clique para copiar"
          >
            {roomCode}
            {copied ? (
              <Check size={20} className="text-green-500" />
            ) : (
              <ClipboardCopy size={20} className="text-gray-400" />
            )}
          </div>
        </div>

        {/*SEÇÃO PARA O DISCORD */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Chat de Voz (Discord)
          </label>
          <div className="bg-gray-900/50 p-2.5 rounded-lg text-center border border-gray-700">
            {discordLink ? (
              <a
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline flex items-center justify-center gap-2"
              >
                <span className="text-sm">Entrar no Chat de Voz</span>
              </a>
            ) : (
              <span className="text-gray-500">Gerando link...</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Limite de Jogadores: <span className="text-apocal-laranjaClaro">{limiteJogadores}</span>
          </label>
          <input
            type="range"
            min="2"
            max="12"
            value={limiteJogadores}
            onChange={(e) => setLimiteJogadores(Number(e.target.value))}
            className="w-full accent-apocal-laranjaEscuro cursor-pointer"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Modo de Jogo
          </label>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value)}
            className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-apocal-laranjaClaro"
          >
            {modos.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-500 font-medium shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
          >
            Criar Sala
          </button>
        </div>
      </div>
    </div>
  );
}
