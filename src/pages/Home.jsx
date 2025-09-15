import React from "react"; // Adicione esta linha
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarSala } from "../firebase/rooms";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { GAME_MODES } from "../constants/constants";
import { parseBirthDate, calculateAge, validateMinimumAge } from "../utils/ageUtils";
import MainButton from "../components/buttons/MainButton";
import CreateRoomModal from "../components/modals/CreateRoomModal";
import JoinRoomModal from "../components/modals/JoinRoomModal";
import AgeVerificationModal from "../components/modals/AgeVerificationModal";
import { useAuth } from "../context/AuthContext";
import { useSounds } from "../hooks/useSounds";

export default function Home() {
  const { currentUser, logout, loading } = useAuth();
  const [modals, setModals] = useState({
    create: false,
    join: false,
    ageRestricted: false,
  });
  const [ageError, setAgeError] = useState(null);
  const navigate = useNavigate();
  const {playComecar} = useSounds()

  const handleCreateRoom = async (roomData) => {
    try {
      if (!currentUser) {
        alert("Você precisa estar logado para criar uma sala");
        return;
      }

      if ([GAME_MODES.ADULTO, GAME_MODES.DIFICIL].includes(roomData.modo)) {
        if (!validateMinimumAge(roomData.dataNascimento, 18)) {
          setAgeError(`Modo ${roomData.modo} requer 18+ anos`);
          setModals({ ...modals, ageRestricted: true });
          return;
        }
      }

      const codigo = await criarSala(currentUser.uid, {
        ...roomData,
        categorias: roomData.categorias || [],
        criador: currentUser.displayName || currentUser.email,
      });
      playComecar()
      navigate(`/lobby/${codigo}`);
    } catch (err) {
      console.error("Erro ao criar sala:", err);
      alert("Falha ao criar sala. Tente novamente.");
    }
  };

const handleJoinRoom = async (joinData) => {
  try {
    if (!currentUser) {
      alert("Você precisa estar logado para entrar em uma sala");
      return;
    }

    console.log("joinData.dataNascimento", joinData.dataNascimento);

    const salaRef = doc(db, "salas", joinData.chave);
    const salaSnap = await getDoc(salaRef);

    if (salaSnap.exists()) {
      const sala = salaSnap.data();

      try {
        if ([GAME_MODES.ADULTO, GAME_MODES.DIFICIL].includes(sala.modo)) {
          if (!validateMinimumAge(joinData.dataNascimento, 18)) {
            setAgeError("Esta sala é restrita para maiores de 18 anos");
            setModals({ ...modals, ageRestricted: true });
            return;
          }
        }
        playComecar()
      } catch {
        alert("Data de nascimento inválida");
        return;
      }

      const nascimentoDate = parseBirthDate(joinData.dataNascimento);
      const nascimentoFormatado = nascimentoDate.toISOString().split("T")[0];

      const jogador = {
        nome: joinData.nome,
        avatar: joinData.avatar || "👤",
        idade: calculateAge(nascimentoFormatado),
        uid: currentUser.uid,
        email: currentUser.email,
        timestamp: serverTimestamp(),
      };

      await setDoc(doc(db, "salas", joinData.chave, "jogadores", currentUser.uid), jogador);
      localStorage.setItem("playerData", JSON.stringify(jogador));
      navigate(`/lobby/${joinData.chave}`);
    } else {
      alert("Sala não encontrada!");
    }
  } catch (err) {
    console.error("Erro ao entrar na sala:", err);
    alert("Sala não encontrada ou código inválido.");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
      <header className="mb-8 text-center">
        <img
          src="/logo-apocalipticos.svg"
          alt="Logo Apocalípticos"
          className="mx-auto mb-4 max-w-[300px] w-full h-auto"
        />
        <h1 className="text-4xl font-bold mb-2">Apocalípticos🥶</h1>
        <p className="text-lg">
          Sobreviva aos desafios mais absurdos com seus amigos
        </p>
      </header>

      {currentUser ? (
        <>
          <div className="mb-6 text-center">
            <p className="text-xl mb-1">
              {/* Decidir se vai mostrar ou não o nome da pessoa */}
              {/* Bem-vindo, {currentUser.displayName || currentUser.email}! */}
              Bem-vindo!
            </p>
            {/* Reativar depois de criar a função de saida! */}
            {/* <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Sair da conta
            </button> */}
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <MainButton
              onClick={() => setModals({ ...modals, create: true })}
              theme="primary"
            >
              Criar Sala
            </MainButton>

            <MainButton
              onClick={() => setModals({ ...modals, join: true })}
              theme="secondary"
            >
              Entrar na Sala
            </MainButton>
          </div>
        </>
      ) : (
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl mb-4">Faça login para jogar</h2>
          <p className="text-gray-400">
            Você precisa estar logado para criar ou entrar em salas
          </p>
        </div>
      )}

      <CreateRoomModal
        isOpen={modals.create}
        onClose={() => setModals({ ...modals, create: false })}
        onCreate={handleCreateRoom}
      />

      <JoinRoomModal
        isOpen={modals.join}
        onClose={() => setModals({ ...modals, join: false })}
        onJoin={handleJoinRoom}
      />

      <AgeVerificationModal
        isOpen={modals.ageRestricted}
        onClose={() => setModals({ ...modals, ageRestricted: false })}
        message={ageError}
      />
    </div>
  );
}
