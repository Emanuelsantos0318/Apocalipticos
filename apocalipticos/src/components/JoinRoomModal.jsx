import React, { useState, useEffect } from "react";

export default function JoinRoomModal({ isOpen, onClose, onJoin }) {
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [chave, setChave] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNome("");
      setNascimento("");
      setChave("");
      setErro("");
    }
  }, [isOpen]);

  const calcularIdade = (data) => {
    const nascimento = new Date(data);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const handleJoin = () => {
    if (!nome || !nascimento || !chave) {
      setErro("Preencha todos os campos.");
      return;
    }

    const idade = calcularIdade(nascimento);
    if (idade < 18) {
      setErro("Você precisa ter pelo menos 18 anos para jogar.");
      return;
    }

    setErro("");
    onJoin({ nome, nascimento, chave: chave.trim().toUpperCase() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Entrar na Sala</h2>

        {erro && <p className="text-red-500 text-sm text-center mb-2">{erro}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Seu Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: João"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Data de Nascimento:</label>
          <input
            type="date"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Chave de Acesso:</label>
          <input
            type="text"
            value={chave}
            onChange={(e) => setChave(e.target.value)}
            className="w-full p-2 border rounded uppercase"
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
