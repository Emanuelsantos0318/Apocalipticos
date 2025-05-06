import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../components/CreateRoomModal";
import JoinRoomModal from "../components/JoinRoomModal";
import { criarSala } from "../firebase/rooms";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config"; // ajuste o caminho se necessário

export default function Home({ uid }) {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCreateRoom = async (roomData) => {
    if (!uid) return;
    try {
      const codigo = await criarSala(uid, roomData);
      console.log("Código da sala criada:", codigo);
      navigate(`/lobby/${codigo}`);
    } catch (err) {
      console.error("Erro ao criar sala:", err);
    }
  };
  
  const handleJoinRoomModal = async ({ nome, nascimento, avatar, chave }) => {
    const uid = crypto.randomUUID(); // ou use uid do Firebase Auth, se quiser login futuro
  
    const idade = calcularIdade(nascimento);
    const jogador = {
      nome,
      avatar,
      idade,
      uid,
      timestamp: serverTimestamp(),
    };
  
    try {
      await setDoc(doc(db, "salas", chave, "jogadores", uid), jogador);
  
      // salvar no localStorage para uso no Lobby
      localStorage.setItem("uid", uid);
      localStorage.setItem("playerName", nome);
      localStorage.setItem("birthDate", nascimento);
      localStorage.setItem("avatar", avatar);
  
      navigate(`/lobby/${chave}`);
    } catch (err) {
      console.error("Erro ao entrar na sala:", err);
      alert("Erro ao entrar na sala.");
    }
  };
  

  if (!uid) {
    return <div className="text-white text-center mt-20">Carregando...</div>;
  }

  return (
    <div id="home" className="min-h-screen flex flex-col items-center justify-center text-center text-black">
      <h1 className="mb-10 flex items-center gap-2">
        <span role="img" aria-label="skull"></span> Sobreviva aos desafios mais absurdos com seus amigos. Ou beba tentando.
      </h1>

      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-lime-500 text-black font-bold px-6 py-3 rounded-xl mb-6 hover:scale-105 transition"
      >
        Criar Sala
      </button>

      <button
        onClick={() => setShowJoinModal(true)}
        className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition"
      >
        Entrar na Sala
      </button>

      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRoom}
      />

<JoinRoomModal
  isOpen={showJoinModal}
  onClose={() => setShowJoinModal(false)}
  onJoin={handleJoinRoomModal}
/>
    </div>
  );
}
