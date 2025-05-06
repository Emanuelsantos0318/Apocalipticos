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
    <div id="buttonHome" className="text-center mt-10 text-white">
    <h4>Sobreviva aos desafios mais absurdos com seus amigos. Ou beba tentando.</h4>
   

   
      <button onClick={() => setModalCriarSalaAberto(true)}>Criar Sala</button>
<button onClick={() => setModalEntrarSalaAberto(true)}>Entrar na Sala</button>
    </div>
  );
}
