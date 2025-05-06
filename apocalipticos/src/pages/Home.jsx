import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../components/CreateRoomModal";
import JoinRoomModal from "../components/JoinRoomModal";
import { criarSala } from "../firebase/rooms";

export default function Home({ uid }) {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCreateRoom = async (roomData) => {
    if (!uid) return;
    const codigo = await criarSala(uid, roomData);
    navigate(`/lobby/${codigo}`);
  };
  const handleJoinRoomModal = ({ nome, nascimento, chave }) => {
    // Exemplo: salvar no localStorage
    localStorage.setItem("playerName", nome);
    localStorage.setItem("birthDate", nascimento);
    navigate(`/lobby/${chave}`);
  };
  

  if (!uid) {
    return <div className="text-white text-center mt-20">Carregando...</div>;
  }

  return (
    <div id="buttonHome" className="text-center mt-10 text-white">
    <h4>Sobreviva aos desafios mais absurdos com seus amigos. Ou beba tentando.</h4>
   

   
      <button onClick={() => setModalCriarSalaAberto(true)}>Criar Sala</button>
<button onClick={() => setModalEntrarSalaAberto(true)}>Entrar na Sala</button>
    </div>
  );
}
