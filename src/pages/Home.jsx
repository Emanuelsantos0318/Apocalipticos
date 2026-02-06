import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // [UPDATED]
import { criarSala } from "../firebase/rooms";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { GAME_MODES } from "../constants/constants";
import {
  parseBirthDate,
  calculateAge,
  validateMinimumAge,
} from "../utils/ageUtils";
import CreateRoomModal from "../components/modals/CreateRoomModal";
import JoinRoomModal from "../components/modals/JoinRoomModal";
import AgeVerificationModal from "../components/modals/AgeVerificationModal";
import AuthModal from "../components/modals/AuthModal";
import { useAuth } from "../context/AuthContext";
import { useSounds } from "../hooks/useSounds";
import {
  Zap,
  Flame,
  Skull,
  Volume2,
  VolumeX,
  LogIn,
  User,
  LogOut,
} from "lucide-react";
import PageLayout from "../components/PageLayout";

export default function Home() {
  const { currentUser, logout, loading } = useAuth();
  const [modals, setModals] = useState({
    create: false,
    join: false,
    ageRestricted: false,
    auth: false,
  });
  const [ageError, setAgeError] = useState(null);
  const navigate = useNavigate();
  const { playComecar, playHome, stopHome, toggleMusic, playingBgMusic } =
    useSounds();

  useEffect(() => {
    playHome();
    return () => stopHome();
  }, []);

  const handleCreateRoom = async (roomData) => {
    try {
      if ([GAME_MODES.ADULTO, GAME_MODES.DIFICIL].includes(roomData.modo)) {
        if (!validateMinimumAge(roomData.dataNascimento, 18)) {
          setAgeError(`Modo ${roomData.modo} requer 18+ anos`);
          setModals({ ...modals, ageRestricted: true });
          return;
        }
      }

      // [NOVO] Atualiza perfil do usuário se estiver logado e dados forem novos
      if (currentUser && !currentUser.isAnonymous) {
        try {
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              nome: roomData.nomeAdmin || roomData.nome,
              dataNascimento: roomData.dataNascimento,
            },
            { merge: true },
          );
        } catch (error) {
          console.error("Erro ao atualizar perfil:", error);
        }
      }

      const codigo = await criarSala(currentUser.uid, {
        ...roomData,
        categorias: roomData.categorias || [],
        criador: currentUser.displayName || currentUser.email,
        criadorAvatar: currentUser.photoURL || roomData.avatar || "👤",
      });

      const adminData = {
        uid: currentUser.uid,
        nome:
          roomData.nomeAdmin ||
          roomData.nome ||
          currentUser.displayName ||
          "Anônimo",
        avatar:
          currentUser.photoURL ||
          roomData.avatar ||
          roomData.avatarSelecionado ||
          "👤",
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

        // [NOVO] Atualiza perfil do usuário se estiver logado
        if (currentUser && !currentUser.isAnonymous) {
          try {
            await setDoc(
              doc(db, "users", currentUser.uid),
              {
                nome: joinData.nome,
                dataNascimento: joinData.dataNascimento,
              },
              { merge: true },
            );
          } catch (error) {
            console.error("Erro ao atualizar perfil entre:", error);
          }
        }

        playComecar();
        const nascimentoDate = parseBirthDate(joinData.dataNascimento);
        const nascimentoFormatado = nascimentoDate.toISOString().split("T")[0];

        // Usa dados do Auth se disponíveis
        const jogador = {
          nome: joinData.nome || currentUser.displayName,
          avatar: joinData.avatar || currentUser.photoURL || "👤",
          idade: calculateAge(nascimentoFormatado),
          uid: currentUser.uid,
          email: currentUser.email,
          timestamp: serverTimestamp(),
          powerups: {
            shield: 1,
            revenge: 1,
            swap: 1,
          },
        };

        await setDoc(
          doc(db, "salas", joinData.chave, "jogadores", currentUser.uid),
          jogador,
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
        <div className="absolute inset-0 bg-white/2 backdrop-blur-[2px]" />

        {/* BUTTONS CORNER */}
        <div className="absolute top-5 right-5 z-50 flex flex-col items-end gap-3">
          {/* User Profile / Login */}
          {!currentUser || currentUser.isAnonymous ? (
            <button
              onClick={() => setModals({ ...modals, auth: true })}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 px-4 py-2 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1"
            >
              <LogIn className="w-4 h-4" />
              LOGIN / CADASTRO
            </button>
          ) : (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-orange-500/30">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    className="w-6 h-6 rounded-full"
                    alt="Avatar"
                  />
                ) : (
                  <User className="w-5 h-5 text-orange-400" />
                )}
                <span className="font-semibold text-sm text-gray-200">
                  Olá, {currentUser.displayName?.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  title="Sair"
                  className="ml-2 hover:bg-white/10 p-1 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                </button>
              </div>
              {currentUser.email && (
                <span className="text-[10px] text-gray-400 mr-2 mt-1 shadow-black drop-shadow-md">
                  Conta Verificada
                </span>
              )}
            </div>
          )}
        </div>

        <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto text-center mt-12 sm:mt-0">
          {/* LOGO E TÍTULO */}
          <header className="text-center mb-6 sm:mb-8 flex flex-col items-center gap-2 px-4 max-w-3xl">
            <style>{`
                  /* ... (estilos de animação removidos por brevidade, mantidos no CSS global se possível ou aqui se preferir) ... */
                  .heartbeat-img {
                    transform-origin: center;
                    will-change: transform, opacity, filter;
                    animation: heartbeat 2.9s cubic-bezier(.215,.61,.355,1) infinite, lightning 4s ease-in-out infinite;
                  }
                  @keyframes heartbeat {
                    0%   { transform: scale(1) translateY(0); opacity: 1; }
                    14%  { transform: scale(1.12) translateY(-6px); opacity: 0.9; }
                    28%  { transform: scale(0.98) translateY(0); opacity: 1; }
                    42%  { transform: scale(1.06) translateY(-3px); opacity: 0.95; }
                    70%  { transform: scale(1) translateY(0); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                  }
                  @keyframes lightning {
                    0%, 90% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
                    91% { filter: brightness(2) drop-shadow(0 0 10px #fbbf24); transform: scale(1.13) translateY(-7px) skewX(-2deg); }
                    92% { filter: brightness(1); transform: scale(1.12) translateY(-6px); }
                    93% { filter: brightness(3) drop-shadow(0 0 20px #fbbf24); transform: scale(1.15) translateY(-5px) skewX(2deg); }
                    94% { filter: brightness(1); transform: scale(1.12) translateY(-6px); }
                    100% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
                  }
             `}</style>

            <img
              src="/logo-apocalipticos.svg"
              alt="Logo Apocallípticos" // Mantendo original conforme title, mas corrigindo para semântica se possível
              className="heartbeat-img mx-auto mb-3 w-40 sm:w-56 md:w-64 max-w-[80%] object-contain"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide drop-shadow-lg">
              Apocallípticos
            </h1>
            <p className="title text-gray-300 mt-2 text-sm sm:text-base md:text-lg leading-relaxed">
              Sobreviva aos desafios mais absurdos com seus amigos.
            </p>
          </header>

          {/* BOTÕES COM LINKS SEMÂNTICOS E ONCLICK PRESERVED */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center w-full max-w-xs sm:max-w-md">
            {/* O modal precisa ser aberto, então mantemos o onClick, mas podemos usar um componente button mais semântico ou Link se levasse direto a uma rota */}
            {/* Como abre modal, button é o correto semanticamente conforme W3C. Para SEO, se não leva a outra página, button é ok. */}
            {/* O problema reportado era 'nav imperativa'. Se estes botões apenas abrem modal, o button está correto. Se levassem para /criar-sala, seria Link. */}
            {/* Vou manter button pois abrem modais, mas adicionar aria-label para acessibilidade explícita. */}

            <button
              onClick={() => setModals({ ...modals, create: true })}
              className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform duration-200 hover:-translate-y-1 w-full"
              aria-label="Criar uma nova sala de jogo"
            >
              Criar Sala
            </button>
            <button
              onClick={() => setModals({ ...modals, join: true })}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform duration-200 hover:-translate-y-1 w-full"
              aria-label="Entrar em uma sala existente"
            >
              Entrar na Sala
            </button>
          </div>

          {(!currentUser || currentUser.isAnonymous) && (
            <p
              className="text-xs text-gray-400 mb-6 cursor-pointer hover:text-orange-400 transition-colors"
              onClick={() => setModals({ ...modals, auth: true })}
            >
              Jogue agora, registre-se depois para salvar seu progresso.
            </p>
          )}

          {/* CARDS DE INFORMAÇÃO - HIERARQUIA FIX H2 -> H3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 max-w-5xl w-full px-6">
            <section className="bg-black/50 backdrop-blur-md p-6 rounded-xl text-center border border-orange-500/30 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-orange-400 shadow-md">
              <Zap className="mx-auto text-orange-400 w-8 h-8 mb-2" />
              <h2 className="font-semibold text-lg sm:text-xl">Multijogador</h2>
              <p className="text-gray-300 text-sm">
                Jogue com amigos em tempo real, e faça aquela pergunta secreta!
              </p>
            </section>

            <section className="bg-black/50 backdrop-blur-md p-6 rounded-xl text-center border border-orange-500/30 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-orange-400 shadow-md">
              <Flame className="mx-auto text-orange-400 w-8 h-8 mb-2" />
              <h2 className="font-semibold text-lg sm:text-xl">3 Modos</h2>
              <p className="text-gray-300 text-sm">Normal, +18 e Difícil</p>
            </section>

            <section className="bg-black/50 backdrop-blur-md p-6 rounded-xl text-center border border-orange-500/30 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-orange-400 shadow-md">
              <Skull className="mx-auto text-orange-400 w-8 h-8 mb-2" />
              <h2 className="font-semibold text-lg sm:text-xl">
                Jogo de bebida
              </h2>
              <p className="text-gray-300 text-sm">
                Desafios e punições épicas, sua criatividade é a nossa diversão.
              </p>
            </section>
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
          <AuthModal
            isOpen={modals.auth}
            onClose={() => setModals({ ...modals, auth: false })}
          />

          {/* BOTÃO DE MÚSICA */}
          <button
            onClick={() => toggleMusic("musicaTema")}
            className="fixed bottom-5 right-5 bg-black/50 backdrop-blur-sm border border-orange-400 text-white p-3 rounded-full shadow-lg hover:scale-110 hover:bg-black/70 transition-transform duration-200 z-50"
            title={
              playingBgMusic === "musicaTema" ? "Parar música" : "Tocar música"
            }
            aria-label="Controle de música de fundo"
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
