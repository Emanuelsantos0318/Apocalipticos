import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { criarSala } from '../firebase/rooms';

export default function Home({ uid }) {
  const navigate = useNavigate();
  const [modo, setModo] = useState('casual');
  const [code, setCode] = useState("");

  const handleCriarSala = async () => {
    if (!uid) return;
    const codigo = await criarSala(uid, modo);
    navigate(`/lobby/${codigo}`);
  };

  const handleJoinRoom = () => {
    if (code.trim()) {
      navigate(`/lobby/${code.trim().toUpperCase()}`);
    }
  };

  // Exibe tela de carregamento até o UID estar disponível
  if (!uid) {
    return <div className="text-whidte text-center  mt-20">Carregando...</div>;
  }

  return (
    <div className="text-center mt-10 text-white">
      <h1 className="text-3xl font-bold mb-4">Apocalípticos!</h1>

      <select
        value={modo}
        onChange={(e) => setModo(e.target.value)}
        className="text-black px-4 py-2 rounded mb-4"
      >
        <option value="casual">Casual</option>
        <option value="hardcore">Hardcore</option>
      </select>

      <br />
      <button
        onClick={handleCriarSala}
        className="bg-orange-600 hover:bg-orange-800 px-6 py-2 rounded text-white font-bold"
      >
        Criar Sala
      </button>

      <div className="mt-6">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite o código da sala"
          className="text-black px-4 py-2 rounded"
        />
        <button
          onClick={handleJoinRoom}
          className="ml-2 bg-green-600 hover:bg-green-800 px-4 py-2 rounded text-white font-bold"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
