import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useSounds } from "../hooks/useSounds";

// Hooks Customizados
import { useGameRoom } from "../hooks/game/useGameRoom";
import { useGameActions } from "../hooks/game/useGameActions";
import { useVoting } from "../hooks/game/useVoting";
import { usePowerUpActions } from "../hooks/game/usePowerUpActions";

// Componentes
import PageLayout from "../components/PageLayout";
import { GameHeader } from "../components/game/GameHeader";
import CardDisplay from "../components/game/CardDisplay";
import PlayerActions from "../components/game/PlayerActions";
import PlayerStatusGrid from "../components/game/PlayerStatusGrid";
import Timer from "../components/game/Timer";
import RankingJogadores from "../components/ranking/RankingJogadores";
import VotingArea from "../components/game/VotingArea";
import Podium from "../components/game/Podium";
import ChoiceModal from "../components/game/ChoiceModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import PowerUpBar from "../components/game/PowerUpBar";
import ClassAbilityModal from "../components/game/ClassAbilityModal";
// Componentes Refatorados [NEW]
import RevengeSelectorModal from "../components/game/RevengeSelectorModal";
import ActionStatusBoard from "../components/game/ActionStatusBoard";
import GameStartControls from "../components/game/GameStartControls";
import DictatorControls from "../components/game/DictatorControls";
import ChaosEventOverlay from "../components/game/chaos/ChaosEventOverlay";

import { CARD_TYPES } from "../constants/constants";
import { Volume2, VolumeX, Zap } from "lucide-react"; // Skull removed (used in RevengeSelectorModal)

export default function Jogo() {
  const { codigo } = useParams();
  const { currentUser: user } = useContext(AuthContext);
  const navigate = useNavigate();
  const meuUid = user?.uid;

  // 0. Sounds (Background Music)
  const { playJogo, stopJogo, toggleMusic, playingBgMusic } = useSounds();

  const isMuted = playingBgMusic !== "musicaJogo";

  // 1. Dados da Sala e Jogadores
  const { sala, jogadores, timeLeft, setTimeLeft, loading } = useGameRoom(
    codigo,
    meuUid,
  );

  // 2. Ações de Jogo (Cartas, Escolhas, Admin, Eu Nunca)
  const gameActions = useGameActions(
    codigo,
    sala,
    jogadores,
    meuUid,
    setTimeLeft,
  );

  // 3. Votação (Amigos de Merda)
  const voting = useVoting(codigo, sala, jogadores, meuUid);

  // 4. Power Ups
  const meuJogador = jogadores.find((j) => j.uid === meuUid);
  // Passando gameActions para o hook de powerups poder chamar passarVez e sortearCarta
  const powerUps = usePowerUpActions(
    codigo,
    meuUid,
    meuJogador,
    jogadores,
    gameActions,
  );

  // Estados locais UI
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showForceModal, setShowForceModal] = useState(null); // null, 'VOTE', 'NEVER'
  const [showRanking, setShowRanking] = useState(false);
  const [showAbilityModal, setShowAbilityModal] = useState(false);
  const [customRole, setCustomRole] = useState(null); // Para eventos (Ex: Ditador)

  // Computed Values
  const currentPlayer = sala?.jogadorAtual;
  const isCurrentPlayer = currentPlayer === meuUid;
  const isVotingRound = sala?.cartaAtual?.tipo === CARD_TYPES.FRIENDS;
  const isNeverRound = sala?.cartaAtual?.tipo === CARD_TYPES.NEVER;

  // No Eu Nunca, todos veem as ações. Nos outros, só o jogador da vez.
  // Usamos gameActions.actionTaken para saber se ação foi feita
  const showActions =
    (isCurrentPlayer || isNeverRound) &&
    !gameActions.actionTaken &&
    sala?.cartaAtual;

  // --- EFEITOS ----

  // Música de Fundo
  useEffect(() => {
    if (sala?.status === "completed") {
      stopJogo();
    } else {
      playJogo();
    }
    return () => stopJogo();
  }, [sala?.status]);

  // Timer da Rodada (Lógica Local com Fallback para Hooks)
  useEffect(() => {
    if (
      timeLeft > 0 &&
      sala?.cartaAtual &&
      !voting.resultadoVotacao &&
      sala?.statusAcao !== "aguardando_confirmacao"
    ) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (
      timeLeft === 0 &&
      !voting.resultadoVotacao &&
      sala?.statusAcao !== "aguardando_confirmacao"
    ) {
      if (isVotingRound) {
        voting.calcularResultadoVotacao(voting.votos);
      } else if (isCurrentPlayer && sala?.cartaAtual?.tipo !== "CAOS") {
        gameActions.handlePenalidade();
      }
    }
  }, [
    timeLeft,
    sala?.cartaAtual,
    isVotingRound,
    voting.resultadoVotacao,
    voting.votos,
    sala?.statusAcao,
    isCurrentPlayer,
  ]);

  // Timer da Escolha (Verdade/Desafio) - Usando estado do Hook
  useEffect(() => {
    if (gameActions.showChoiceModal && gameActions.choiceTimeLeft > 0) {
      const timer = setTimeout(
        () => gameActions.setChoiceTimeLeft((prev) => prev - 1),
        1000,
      );
      return () => clearTimeout(timer);
    } else if (
      gameActions.showChoiceModal &&
      gameActions.choiceTimeLeft === 0
    ) {
      const randomType =
        Math.random() > 0.5 ? CARD_TYPES.TRUTH : CARD_TYPES.DARE;
      gameActions.handleChoice(randomType);
    }
  }, [gameActions.showChoiceModal, gameActions.choiceTimeLeft]);

  // --- HANDLERS UI (Wrappers para Hooks ou Locais) ---

  const handleLeaveGame = () => {
    setShowLeaveModal(true);
  };

  const confirmLeaveGame = async () => {
    // Import dinâmico ou uso direto se importado?
    // Usaremos a função auxiliar do firebase/rooms importada no hook useGameActions?
    // O hook useGameActions importa sairDaSala, mas não exporta.
    // Vamos importar no topo do arquivo se necessário, ou adicionar ao hook.
    // Melhor: Importar sairDaSala diretamente aqui para não poluir o hook com navegação local
    const { sairDaSala } = await import("../firebase/rooms");
    try {
      await sairDaSala(codigo, user.uid);
      toast.success("Você saiu da sala.");
      navigate("/app");
    } catch (error) {
      console.error("Erro ao sair da sala:", error);
      toast.error("Erro ao sair da sala.");
    } finally {
      setShowLeaveModal(false);
    }
  };

  if (loading || !sala) {
    return <div className="text-white text-center p-8">Carregando jogo...</div>;
  }

  // Se o jogo acabou, mostra o Pódio
  if (sala.status === "completed") {
    // Podium precisa de props
    return (
      <Podium
        jogadores={jogadores}
        onBackToLobby={
          gameActions.handleBackToLobby ||
          (() => gameActions.resetGameData("waiting"))
        }
        onRestart={
          gameActions.handleRestartGame ||
          (() => gameActions.resetGameData("playing"))
        }
      />
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen text-white p-4 flex justify-center">
        <div className="w-full max-w-2xl mx-auto relative">
          {/* ÁREA DO JOGO */}
          <div className="w-full">
            <GameHeader
              codigo={codigo}
              modo={sala.modo}
              currentPlayer={currentPlayer}
              isCurrentPlayer={isCurrentPlayer}
              jogadores={jogadores} // Updated
              onLeave={handleLeaveGame}
              isHost={jogadores.find((j) => j.uid === meuUid)?.isHost}
              onFinishGame={() => gameActions.setShowFinishConfirmModal(true)}
              sala={sala}
              // Removido props de musica redundantes
            />

            {sala.cartaAtual ? (
              <>
                <CardDisplay
                  carta={sala.cartaAtual}
                  timeLeft={timeLeft}
                  activeEvents={sala.activeEvents}
                />

                {/* Visualizar Power-ups (Não mostra em Eventos do Caos) */}
                {isCurrentPlayer &&
                  !gameActions.actionTaken &&
                  !isVotingRound &&
                  !isNeverRound &&
                  sala.cartaAtual.tipo !== "CAOS" && (
                    <PowerUpBar
                      powerups={meuJogador?.powerups}
                      onUse={(type) => {
                        if (type === "shield") powerUps.handleUseShield();
                        if (type === "swap") powerUps.handleUseSwap();
                        if (type === "revenge") powerUps.handleUseRevenge();
                      }}
                      disabled={!!voting.resultadoVotacao || !!sala.statusAcao}
                    />
                  )}

                {/* Modal de Seleção de Vingança [REFACTORED] */}
                <RevengeSelectorModal
                  isOpen={powerUps.showRevengeSelector}
                  jogadores={jogadores}
                  meuUid={meuUid}
                  onConfirm={powerUps.handleConfirmRevenge}
                  onCancel={() => powerUps.setShowRevengeSelector(false)}
                />

                {/* Área de Votação (Amigos de Merda) */}
                {isVotingRound ? (
                  <div className="mt-6">
                    <VotingArea
                      jogadores={jogadores} // Use Masked Only For Votes if Envy active? Or standard? Masked makes sense based on prompt.
                      meuUid={meuUid}
                      onVote={voting.handleVote}
                      votos={voting.votos}
                      resultado={voting.resultadoVotacao}
                    />

                    {!voting.resultadoVotacao && (
                      <div className="flex flex-col items-center justify-center mt-6 gap-3">
                        <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-500/30 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse">
                          <p className="text-purple-200 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                            Aguardando Votos:{" "}
                            <span className="text-white text-lg">
                              {Object.keys(voting.votos).length}
                            </span>{" "}
                            / {jogadores.length}
                          </p>
                        </div>
                        {jogadores.find((j) => j.uid === meuUid)?.isHost &&
                          Object.keys(voting.votos).length > 0 && (
                            <button
                              onClick={() =>
                                setShowForceModal({ type: "VOTE" })
                              }
                              className="group flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/20"
                            >
                              Forçar Encerramento
                            </button>
                          )}
                      </div>
                    )}

                    {voting.resultadoVotacao && isCurrentPlayer && (
                      <div className="text-center mt-6">
                        <button
                          onClick={() => gameActions.passarVez()}
                          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold animate-bounce"
                        >
                          Próxima Rodada
                        </button>
                      </div>
                    )}
                  </div>
                ) : sala.statusAcao ? (
                  // Status de Ação (Aguardando Confirmação) [REFACTOR]
                  <ActionStatusBoard
                    sala={sala}
                    jogadores={jogadores}
                    meuUid={meuUid}
                    gameActions={gameActions}
                    setCustomRole={setCustomRole}
                    setShowAbilityModal={setShowAbilityModal}
                    isHost={jogadores.find((j) => j.uid === meuUid)?.isHost}
                  />
                ) : (
                  // Ações Normais ou Chaos Actions
                  <>
                    <ChaosEventOverlay
                      sala={sala}
                      jogadores={jogadores}
                      meuUid={meuUid}
                      gameActions={gameActions}
                      setCustomRole={setCustomRole}
                      setShowAbilityModal={setShowAbilityModal}
                    />

                    {showActions && sala.cartaAtual.tipo !== "CAOS" && (
                      <PlayerActions
                        onComplete={gameActions.handleComplete}
                        onPenalidade={gameActions.handlePenalidade}
                        onEuJa={gameActions.handleEuJa}
                        onEuNunca={gameActions.handleEuNunca}
                        cardType={sala.cartaAtual.tipo}
                      />
                    )}
                  </>
                )}

                {/* Botão de Próxima Rodada para Eu Nunca */}
                {isNeverRound && (
                  <>
                    <PlayerStatusGrid
                      jogadores={jogadores} // Updated
                      acoes={gameActions.acoesRodada}
                    />
                    {(isCurrentPlayer ||
                      jogadores.find((j) => j.uid === meuUid)?.isHost) && (
                      <div className="text-center mt-6">
                        {Object.keys(gameActions.acoesRodada).length ===
                        jogadores.length ? (
                          <button
                            onClick={() => gameActions.passarVez()}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 mx-auto"
                          >
                            Próxima Rodada
                          </button>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <span className="font-medium text-sm animate-pulse">
                              Aguardando todos responderem...
                            </span>
                            {jogadores.find((j) => j.uid === meuUid)
                              ?.isHost && (
                              <button
                                onClick={() =>
                                  setShowForceModal({ type: "NEVER" })
                                }
                                className="text-xs font-medium text-red-400 border border-red-500/20 px-3 py-1 rounded"
                              >
                                Forçar Próxima Rodada
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <Timer timeLeft={timeLeft} totalTime={30} />
              </>
            ) : (
              // START GAME BUTTON [REFACTOR]
              <div className="text-center py-12">
                <GameStartControls
                  isCurrentPlayer={isCurrentPlayer}
                  currentPlayerName={
                    jogadores.find((j) => j.uid === currentPlayer)?.nome
                  }
                  gameActions={gameActions}
                  meuJogador={meuJogador}
                  sala={sala}
                  onOpenAbilityModal={() => setShowAbilityModal(true)}
                />
              </div>
            )}
          </div>

          {/* RANKING DESKTOP */}
          <div className="hidden min-[1340px]:block fixed top-2 right-2 w-[250px] 2xl:w-[320px] transition-all duration-300">
            <h1 className="text-xl font-bold mb-2 text-center text-purple-300 drop-shadow-md !p-[3%]">
              Ranking
            </h1>
            <RankingJogadores jogadores={jogadores} meuUid={meuUid} />{" "}
            {/* Updated */}
          </div>
        </div>

        {/* RANKING MOBILE */}
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="min-[1340px]:hidden fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all"
        >
          <Trophy size={24} />
        </button>

        {showRanking && (
          <div className="min-[1340px]:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm relative">
              <button
                onClick={() => setShowRanking(false)}
                className="absolute -top-2 -right-2  bg-red-500 text-white rounded-full p-2 z-50 shadow-lg"
              >
                X
              </button>
              <h2 className="text-xl font-bold mb-4 text-center text-white">
                Ranking
              </h2>
              <RankingJogadores jogadores={jogadores} meuUid={meuUid} />{" "}
              {/* Updated */}
            </div>
          </div>
        )}

        {/* MODAIS */}
        <ChoiceModal
          isOpen={gameActions.showChoiceModal}
          timeLeft={gameActions.choiceTimeLeft}
          onChoice={gameActions.handleChoice}
        />

        <ConfirmModal
          isOpen={showLeaveModal}
          title="Sair da sala?"
          message="Se você sair, perderá sua pontuação atual."
          onConfirm={confirmLeaveGame}
          onCancel={() => setShowLeaveModal(false)}
        />

        <ConfirmModal
          isOpen={showForceModal !== null}
          title="Forçar Encerramento?"
          message={
            showForceModal === "VOTE"
              ? "Isso vai encerrar a votação e contabilizar os votos atuais."
              : "Isso vai pular para a próxima rodada mesmo sem todos responderem."
          }
          onConfirm={() => {
            if (showForceModal === "VOTE")
              voting.calcularResultadoVotacao(voting.votos);
            if (showForceModal === "NEVER") gameActions.passarVez();
            setShowForceModal(null);
          }}
          onCancel={() => setShowForceModal(null)}
        />

        <ConfirmModal
          isOpen={gameActions.showFinishConfirmModal}
          title="Encerrar Jogo?"
          message="O jogo será finalizado e o Pódio será exibido. Tem certeza?"
          onConfirm={gameActions.handleFinishGame}
          onCancel={() => gameActions.setShowFinishConfirmModal(false)}
        />

        <ClassAbilityModal
          isOpen={showAbilityModal}
          onClose={() => {
            setShowAbilityModal(false);
            setCustomRole(null); // Limpa role customizada ao fechar
          }}
          userRoleKey={meuJogador?.role}
          customRole={customRole}
          jogadores={jogadores}
          meuUid={meuUid}
          onUseAbility={(uid, roleId, targetUid) => {
            if (roleId === "ditador") {
              gameActions.handleMultar(targetUid);
            } else if (roleId === "cupido" || roleId === "parceiro_luxuria") {
              gameActions.handleLinkSoul(targetUid);
            } else if (roleId === "carrasco") {
              gameActions.handleDuel(uid, targetUid);
            } else {
              gameActions.handleUseAbility(uid, roleId, targetUid);
            }
          }}
          activeEvents={sala?.activeEvents} // PASSING EVENTS FOR FILTERING
        />

        {/* BOTÃO DITADOR (ORGULHO) [REFACTOR] */}
        <DictatorControls
          activeEvents={sala?.activeEvents}
          meuUid={meuUid}
          onOpenAbilityModal={setShowAbilityModal}
        />

        {/* BOTÃO DE MÚSICA (Floating) */}
        <button
          onClick={() => toggleMusic("musicaJogo")}
          className="fixed bottom-5 left-5 bg-black/50 backdrop-blur-sm border border-orange-400 text-white p-3 rounded-full shadow-lg hover:scale-110 hover:bg-black/70 transition-transform duration-200"
          title={
            playingBgMusic === "musicaJogo" ? "Parar música" : "Tocar música"
          }
        >
          {playingBgMusic === "musicaJogo" ? (
            <Volume2 className="w-6 h-6 text-orange-400" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>
    </PageLayout>
  );
}

// Pequeno helper para icone Trophy se nao importado
function Trophy({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
