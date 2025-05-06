import React, { useState, useEffect } from "react";

const modos = [
  { value: "facil", label: "Modo Fácil (Família)" },
  { value: "normal", label: "Modo Normal" },
  { value: "18", label: "Modo +18" },
  { value: "dificil", label: "Modo Difícil" },
];

const categoriasDisponiveis = [
  "Desafios",
  "Perguntas",
  "Mímica",
  "Bebidas",
  "Aleatório",
];

function gerarCodigoSala() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: 5 }, () =>
    letras[Math.floor(Math.random() * letras.length)]
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
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRoomCode(gerarCodigoSala());
      setLimiteJogadores(6);
      setModo("normal");
      setCategorias([]);
      setNome("");
      setDataNascimento("");
    }
  }, [isOpen]);

  const toggleCategoria = (cat) => {
    setCategorias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    if (!nome || !dataNascimento) {
      alert("Preencha seu nome e data de nascimento.");
      return;
    }

    const idade = calcularIdade(dataNascimento);
    if (idade < 18 && (modo === "18" || modo === "dificil")) {
      alert("Modos +18 e Difícil não estão disponíveis para menores de idade.");
      return;
    }

    const roomData = {
      roomCode,
      limiteJogadores,
      modo,
      categorias,
      nomeAdmin: nome,
      dataNascimento,
    };
    onCreate(roomData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Criar Sala</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Seu nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 rounded border"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Data de nascimento:</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full p-2 rounded border"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Código da Sala:</label>
          <div className="bg-gray-100 p-2 rounded text-center font-mono text-lg">
            {roomCode}
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Modo de Jogo:</label>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value)}
            className="w-full p-2 rounded border"
          >
            {modos.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Categorias:</label>
          <div className="grid grid-cols-2 gap-2">
            {categoriasDisponiveis.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categorias.includes(cat)}
                  onChange={() => toggleCategoria(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
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
