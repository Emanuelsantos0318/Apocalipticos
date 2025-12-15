import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarSala } from "../firebase/rooms";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { GAME_MODES } from "../constants/constants";
import {
  parseBirthDate,
  calculateAge,
  validateMinimumAge,
} from "../utils/ageUtils";
import MainButton from "../components/buttons/MainButton";
import CreateRoomModal from "../components/modals/CreateRoomModal";
import JoinRoomModal from "../components/modals/JoinRoomModal";
import AgeVerificationModal from "../components/modals/AgeVerificationModal";
// importe useAuth (já presente no seu arquivo)
import { useAuth } from "../context/AuthContext";
import { useSounds } from "../hooks/useSounds";
import { Zap, Flame, Skull } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { Volume2, VolumeX } from "lucide-react"; // ícones de som

export default function Home() {
  const { currentUser, logout, loading } = useAuth();
  const [modals, setModals] = useState({
    create: false,
    join: false,
    ageRestricted: false,
  });
  const [ageError, setAgeError] = useState(null);
  const navigate = useNavigate();
  const { playComecar, playHome, stopHome, toggleMusic, playingBgMusic } = useSounds();

  useEffect(() => {
    playHome(); // toca ao entrar na Home
    return () => stopHome(); // para a música ao sair
  }, []);

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

   // Salvar dados do administrador no localStorage (compatível com campos do modal)
      const adminData = {
        uid: currentUser.uid,
        nome:
          roomData.nomeAdmin ||
          roomData.nome ||
          currentUser.displayName ||
          currentUser.email,
        avatar: roomData.avatar || roomData.avatarSelecionado || "👤",
        email: currentUser.email,
      };
      localStorage.setItem("playerData", JSON.stringify(adminData));

      playComecar();
      stopHome();
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

      const salaRef = doc(db, "salas", joinData.chave);
      const salaSnap = await getDoc(salaRef);

      if (salaSnap.exists()) {
        const sala = salaSnap.data();

        if ([GAME_MODES.ADULTO, GAME_MODES.DIFICIL].includes(sala.modo)) {
          if (!validateMinimumAge(joinData.dataNascimento, 18)) {
            setAgeError("Esta sala é restrita para maiores de 18 anos");
            setModals({ ...modals, ageRestricted: true });
            return;
          }
        }

        playComecar();
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

        await setDoc(
          doc(db, "salas", joinData.chave, "jogadores", currentUser.uid),
          jogador
        );
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
    <PageLayout>
      <div
        className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center justify-center text-white px-4"
        style={{
          backgroundImage: "url('/bg-apocalipticos.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/2 backdrop-blur-[2px]" />{" "}
        {/* overlay escuro */}
        <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto text-center">
          {/* LOGO E TÍTULO */ }
          <header className="text-center mb-6 sm:mb-8 flex flex-col items-center gap-2 px-4 max-w-3xl">
            <style>{`
              .heartbeat-img {
                transform-origin: center;
                will-change: transform, opacity, filter;
                animation: heartbeat 2.9s cubic-bezier(.215,.61,.355,1) infinite, lightning 4s ease-in-out infinite;
              }

              /* animação principal (batida) */
              @keyframes heartbeat {
                0%   { transform: scale(1) translateY(0); opacity: 1; }
                14%  { transform: scale(1.12) translateY(-6px); opacity: 0.9; }
                28%  { transform: scale(0.98) translateY(0); opacity: 1; }
                42%  { transform: scale(1.06) translateY(-3px); opacity: 0.95; }
                70%  { transform: scale(1) translateY(0); opacity: 1; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
              }

              /* animação de raios/eletricidade */
              @keyframes lightning {
                0%, 90% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
                91% { filter: brightness(2) drop-shadow(0 0 10px #fbbf24); transform: scale(1.13) translateY(-7px) skewX(-2deg); }
                92% { filter: brightness(1); transform: scale(1.12) translateY(-6px); }
                93% { filter: brightness(3) drop-shadow(0 0 20px #fbbf24); transform: scale(1.15) translateY(-5px) skewX(2deg); }
                94% { filter: brightness(1); transform: scale(1.12) translateY(-6px); }
                100% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
              }

              /* efeito de "piscar" sutil sincronizado com a batida */
              .heartbeat-img::after { content: ""; }
              /* se quiser um piscar mais pronunciado, adicione uma segunda animação:
                 animation: heartbeat 1.2s cubic-bezier(...) infinite, blink 1.2s linear infinite;
              */
              @keyframes blink {
                0%   { opacity: 1; }
                12%  { opacity: 0.6; }
                24%  { opacity: 1; }
                100% { opacity: 1; }
              }
            `}</style>

            <img
              src="/logo-apocalipticos.svg"
              alt="Logo Apocalípticos"
              className="heartbeat-img mx-auto mb-3 w-40 sm:w-56 md:w-64 max-w-[80%] object-contain"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide drop-shadow-lg">
              Apocallípticos
            </h1>
            <p className="title text-gray-300 mt-2 text-sm sm:text-base md:text-lg leading-relaxed">
              Sobreviva aos desafios mais absurdos com seus amigos.
              <br/><span></span>
            </p>
          </header>

          {/* BOTÕES */}
          {currentUser ? (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center w-full max-w-xs sm:max-w-md">
                <button
                  onClick={() => setModals({ ...modals, create: true })}
                  className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform duration-200 hover:-translate-y-1 w-full"
                >
                  Criar Sala
                </button>
                <button
                  onClick={() => setModals({ ...modals, join: true })}
                  className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform duration-200 hover:-translate-y-1 w-full"
                >
                  Entrar na Sala
                </button>
              </div>
            </>
          ) : (
            <div className="bg-black/50 p-5 rounded-lg text-center mx-4">
              <h2 className="text-2xl mb-2 font-semibold">
                Faça login para jogar
              </h2>
              <p className="text-gray-300 text-sm">
                Você precisa estar logado para criar ou entrar em salas
              </p>
            </div>
          )}

          {/* CARDS DE INFORMAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 max-w-5xl w-full px-6">
            <div className="bg-black/50 backdrop-blur-md p-6 rounded-xl text-center border border-orange-500/30 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-orange-400 shadow-md">
              <Zap className="mx-auto text-orange-400 w-8 h-8 mb-2" />
              <h3 className="font-semibold text-lg sm:text-xl">Multijogador</h3>
              <p className="text-gray-300 text-sm">
                Jogue com amigos em tempo real, e faça aquela pergunta secreta!
              </p>
            </div>

            <div className="bg-black/50 backdrop-blur-md p-6 rounded-xl text-center border border-orange-500/30 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-orange-400 shadow-md">
              <Flame className="mx-auto text-orange-400 w-8 h-8 mb-2" />
              <h3 className="font-semibold text-lg sm:text-xl">3 Modos</h3>
              <p className="text-gray-300 text-sm">Normal, +18 e Difícil</p>
            </div>

            <div className="bg-black/50 backdrop-blur-md p-6 rounded-xl text-center border border-orange-500/30 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-orange-400 shadow-md">
              <Skull className="mx-auto text-orange-400 w-8 h-8 mb-2" />
              <h3 className="font-semibold text-lg sm:text-xl">
                Jogo de bebida
              </h3>
              <p className="text-gray-300 text-sm">
                Desafios e punições épicas, sua criatividade é a nossa diversão.
              </p>
            </div>
          </div>

          {/* MODAIS */}
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

          {/* BOTÃO DE MÚSICA */}
          <button
            onClick={() => toggleMusic("musicaTema")}
            className="fixed bottom-5 right-5 bg-black/50 backdrop-blur-sm border border-orange-400 text-white p-3 rounded-full shadow-lg hover:scale-110 hover:bg-black/70 transition-transform duration-200"
            title={playingBgMusic === "musicaTema" ? "Parar música" : "Tocar música"}
          >
            {playingBgMusic === "musicaTema" ? (
              <Volume2 className="w-6 h-6 text-orange-400" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </main>
      </div>
    </PageLayout>
  );
}
