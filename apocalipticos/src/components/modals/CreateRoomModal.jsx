import React from "react"; // Adicione esta linha
import { useState, useEffect } from "react";
import { ClipboardCopy, Check } from "lucide-react";

const modos = [
  { value: "normal", label: "Modo Normal" },
  { value: "mais18", label: "Modo +18" },
  { value: "dificil", label: "Modo Difícil" },
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
  const [copied, setCopied] = useState(false); // novo estado para feedback de cópia
  useEffect(() => {
    if (isOpen) {
      setRoomCode(gerarCodigoSala());
      setLimiteJogadores(6);
      setModo("normal");
      setNome("");
      setDataNascimento("");
    }
  }, [isOpen]);

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
    };

    onCreate(roomData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-apocal-laranjaEscuro p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className=" col text-2xl font-bold mb-4 text-center">Criar Sala</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Seu nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 rounded border text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Data de nascimento:
          </label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full p-2 rounded border text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 ">
            Código da Sala:
          </label>
          <div
            onClick={handleCopy}
            className="bg-gray-100 p-2 rounded text-center font-mono text-lg text-black cursor-pointer hover:bg-gray-200 flex items-center justify-center gap-2 transition"
            title="Clique para copiar"
          >
            {roomCode}
            {copied ? (
              <Check size={20} className="text-green-600" />
            ) : (
              <ClipboardCopy size={20} className="text-gray-700" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Limite de Jogadores: {limiteJogadores}
          </label>
          <input
            type="range"
            min="2"
            max="12"
            value={limiteJogadores}
            onChange={(e) => setLimiteJogadores(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Modo de Jogo:
          </label>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value)}
            className="w-full p-2 rounded bg-apocal-escuro text-white"
          >
            {modos.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}
