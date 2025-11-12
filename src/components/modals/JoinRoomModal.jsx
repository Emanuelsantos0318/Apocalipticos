import React from "react"; // Adicione esta linha
import { useState, useEffect } from "react";


const emojis = ["🧟‍♂️", "☢", "☣", "🪓", "🍺", "💥", "👽", "🧨", "🎯", "🔪"];

export default function JoinRoomModal({ isOpen, onClose, onJoin }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setNascimento] = useState("");
  const [chave, setChave] = useState("");
  const [avatar, setAvatar] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNome("");
      setNascimento("");
      setChave("");
      setAvatar("");
      setErro("");
    }
  }, [isOpen]);

const handleJoin = () => {
  if (!nome || !dataNascimento || !chave || !avatar) {
    setErro("Preencha todos os campos e selecione um avatar.");
    return;
  }

  const jogador = {
    nome,
    dataNascimento,
    avatar,
    chave: chave.trim().toUpperCase(),
  };

  localStorage.setItem("playerName", nome);
  localStorage.setItem("birthDate", dataNascimento);
  localStorage.setItem("avatar", avatar);

  setErro("");
  onJoin(jogador);
  onClose();
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-apocal-cinzaEmer p-6 rounded-xl w-full max-w-md shadow-lg border border-apocal-laranjaClaro/30 ">
        <h2 className="text-2xl font-bold mb-4 text-center">Entrar na Sala</h2>

        {erro && (
          <p className="text-red-500 text-sm text-center mb-2">{erro}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Apelido:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border border-apocal-azulClaro/70 rounded"
            placeholder="Ex: João"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Data de nascimento:
          </label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setNascimento(e.target.value)}
            className="w-full p-2 border border-apocal-azulClaro/70 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Avatar (Emoji):
          </label>
          <div className="grid grid-cols-5 gap-2">
                 {emojis.map((e) => (
              <button
                key={e}
                onClick={() => setAvatar(e)}
                className={`text-2xl p-2 rounded border border-apocal-azulClaro/70 focus-visible:ring-2 focus-visible:ring-apocal-laranjaClaro/50 ${
                  avatar === e
                    ? "bg-apocal-laranjaClaro/50 border-2 border-apocal-laranjaEscuro"
                    : "hover:bg-gray-400"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Chave de Acesso:
          </label>
          <input
            type="text"
            value={chave}
            onChange={(e) => setChave(e.target.value)}
            className="w-full p-2 border border-apocal-azulClaro/70 rounded uppercase"
            placeholder="Ex: ABCDE"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleJoin}
            className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
          >
            Entrar na Sala
          </button>
        </div>
      </div>
    </div>
  );
}
