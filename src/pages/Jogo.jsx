import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { db } from "../firebase/config";
import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
  query,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { sortearCarta, proximoJogador, submitVote } from "../firebase/game";
import { sairDaSala } from "../firebase/rooms";
import PageLayout from "../components/PageLayout";
import { GameHeader } from "../components/game/GameHeader";
import CardDisplay from "../components/game/CardDisplay";
import PlayerActions from "../components/game/PlayerActions";
import Timer from "../components/game/Timer";
import RankingJogadores from "../components/ranking/RankingJogadores";
import VotingArea from "../components/game/VotingArea";
import ConfirmModal from "../components/modals/ConfirmModal";
import { CARD_TYPES, CATEGORIES } from "../constants/constants";

export default function Jogo() {
  const { codigo } = useParams();
  const { currentUser: user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [sala, setSala] = useState(null);
  const [jogadores, setJogadores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showRanking, setShowRanking] = useState(false);
  const [actionTaken, setActionTaken] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Estados para Votação (Amigos de Merda)
  const [votos, setVotos] = useState({});
  const [resultadoVotacao, setResultadoVotacao] = useState(null);

  const meuUid = user?.uid;
  const currentPlayer = sala?.jogadorAtual;
  const isCurrentPlayer = currentPlayer === meuUid;
  const showActions = isCurrentPlayer && !actionTaken && sala?.cartaAtual;

  // Se for votação, todos podem agir (votar), não só o jogador da vez
  const isVotingRound = sala?.cartaAtual?.tipo === CARD_TYPES.FRIENDS;
  const showVotingArea = isVotingRound && !resultadoVotacao;

  // Listener da Sala
  useEffect(() => {
    if (!codigo) return;
    const unsub = onSnapshot(doc(db, "salas", codigo), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSala(data);
        if (data.timeLeft !== undefined) setTimeLeft(data.timeLeft);

        // Se a carta mudou ou foi limpa, resetar estados locais
        if (!data.cartaAtual) {
          setResultadoVotacao(null);
          setVotos({});
        }
      } else {
        navigate("/");
      }
    });
    return () => unsub();
  }, [codigo, navigate]);

  // Listener de Jogadores
  useEffect(() => {
    if (!codigo) return;
    const q = collection(db, "salas", codigo, "jogadores");
    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setJogadores(lista);
    });
    return () => unsub();
  }, [codigo]);

  // Listener de Votos (apenas se for rodada de votação)
  useEffect(() => {
    if (!codigo || !isVotingRound) return;

    const q = collection(db, "salas", codigo, "votos");
    const unsub = onSnapshot(q, (snapshot) => {
      const novosVotos = {};
      snapshot.docs.forEach((doc) => {
        novosVotos[doc.id] = doc.data().target;
      });
      setVotos(novosVotos);

      // Verificar se todos votaram
      if (
        Object.keys(novosVotos).length === jogadores.length &&
        jogadores.length > 0
      ) {
        calcularResultadoVotacao(novosVotos);
      }
    });

    return () => unsub();
  }, [codigo, isVotingRound, jogadores.length]);

  // Timer (apenas o ADM ou Jogador Atual decrementa no Firestore para evitar conflitos de escrita)
  // Simplificação: Cada um decrementa local, mas sync via firestore é melhor.
  // Vamos manter o timer visual local por enquanto ou syncado se já existir lógica.
  // O código original tinha setTimeLeft(30) mas não vi o useEffect do timer decrementando.
  // Vou assumir que o componente Timer ou outra lógica cuida disso, ou adicionar um simples aqui.
  useEffect(() => {
    if (
      timeLeft > 0 &&
      sala?.cartaAtual &&
      !resultadoVotacao &&
      sala?.statusAcao !== "aguardando_confirmacao"
    ) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (
      timeLeft === 0 &&
      !resultadoVotacao &&
      sala?.statusAcao !== "aguardando_confirmacao"
    ) {
      if (isVotingRound) {
        // Tempo acabou na votação: forçar resultado parcial
        calcularResultadoVotacao(votos);
      } else if (isCurrentPlayer) {
        // Tempo acabou na ação normal: penalidade automática
        handlePenalidade();
      }
    }
  }, [
    timeLeft,
    sala?.cartaAtual,
    isVotingRound,
    resultadoVotacao,
    votos,
    sala?.statusAcao,
    isCurrentPlayer,
  ]);

  const calcularResultadoVotacao = async (votosAtuais) => {
    if (resultadoVotacao) return; // Já calculado

    const contagem = {};
    Object.values(votosAtuais).forEach((target) => {
      contagem[target] = (contagem[target] || 0) + 1;
    });

    // Encontrar o mais votado
    let maisVotado = null;
    let maxVotos = -1;

    Object.entries(contagem).forEach(([uid, count]) => {
      if (count > maxVotos) {
        maxVotos = count;
        maisVotado = uid;
      }
    });

    if (maisVotado) {
      setResultadoVotacao({ perdedor: maisVotado, totalVotos: maxVotos });

      // Se eu sou o ADM (ou o jogador atual, para simplificar responsabilidade), aplico a penalidade
      // Vamos deixar o jogador atual da rodada responsável por commitar o resultado no banco
      if (isCurrentPlayer) {
        // Penalidade para o mais votado
        const playerRef = doc(db, "salas", codigo, "jogadores", maisVotado);
        await updateDoc(playerRef, {
          "stats.bebeu": increment(1), // Exemplo de penalidade
          ultimaAcao: serverTimestamp(),
        });

        // Limpar votos do banco para a próxima
        // (Isso seria ideal fazer numa cloud function, mas aqui fazemos no client)
        // Deixar para limpar quando passar a vez
      }
    }
  };

  const handleSortearCarta = async () => {
    if (!isCurrentPlayer || !sala) return;

    try {
      const categorias =
        sala.categorias && sala.categorias.length > 0
          ? sala.categorias
          : Object.values(CATEGORIES);
      const carta = await sortearCarta(sala.modo, categorias);
      await updateDoc(doc(db, "salas", codigo), {
        cartaAtual: carta,
        timeLeft: 30,
      });
      setTimeLeft(30);
      setActionTaken(false);
      setResultadoVotacao(null); // Resetar resultado local
    } catch (error) {
      console.error("Erro ao sortear carta:", error);
    }
  };

  const handleComplete = async () => {
    // Em vez de completar direto, pede confirmação
    try {
      await updateDoc(doc(db, "salas", codigo), {
        statusAcao: "aguardando_confirmacao",
      });
    } catch (error) {
      console.error("Erro ao solicitar confirmação:", error);
    }
  };

  const handleAdminConfirm = async () => {
    await updatePlayerStats("completou");
    await updateDoc(doc(db, "salas", codigo), { statusAcao: null }); // Limpa status
    await passarVez();
  };

  const handleAdminReject = async () => {
    await updatePlayerStats("recusou"); // Conta como recusa/falha
    await updateDoc(doc(db, "salas", codigo), { statusAcao: null }); // Limpa status
    await passarVez();
  };

  const handlePenalidade = async () => {
    // Em vez de aplicar direto, pede confirmação de penalidade (bebida)
    try {
      await updateDoc(doc(db, "salas", codigo), {
        statusAcao: "aguardando_penalidade",
      });
    } catch (error) {
      console.error("Erro ao solicitar confirmação de penalidade:", error);
    }
  };

  const handleAdminConfirmPenalty = async () => {
    await updatePlayerStats("recusou"); // Aplica penalidade e conta bebida
    await updateDoc(doc(db, "salas", codigo), { statusAcao: null }); // Limpa status
    await passarVez();
  };

  const handleVote = async (targetUid) => {
    await submitVote(codigo, user.uid, targetUid);
  };

  const handleLeaveGame = () => {
    setShowLeaveModal(true);
  };

  const confirmLeaveGame = async () => {
    try {
      await sairDaSala(codigo, user.uid);
      toast.success("Você saiu da sala.");
      navigate("/");
    } catch (error) {
      console.error("Erro ao sair da sala:", error);
      toast.error("Erro ao sair da sala.");
    } finally {
      setShowLeaveModal(false);
    }
  };

  const passarVez = async () => {
    try {
      const proximoUid = await proximoJogador(codigo, currentPlayer);

      // Limpar votos se houve votação
      if (isVotingRound) {
        const votosRef = collection(db, "salas", codigo, "votos");
        const snapshot = await getDocs(votosRef);
        snapshot.forEach(async (docVote) => {
          await deleteDoc(doc(db, "salas", codigo, "votos", docVote.id));
        });
      }

      await updateDoc(doc(db, "salas", codigo), {
        jogadorAtual: proximoUid,
        cartaAtual: null,
        timeLeft: 30,
      });
      setActionTaken(false);
    } catch (error) {
      console.error("Erro ao passar a vez:", error);
    }
  };

  const updatePlayerStats = async (action) => {
    // Se for o admin confirmando/rejeitando, o 'user' aqui é o admin, mas precisamos atualizar o 'currentPlayer'
    // Então vamos buscar a ref do jogadorAtual da sala, não necessariamente o 'user.uid'
    // Mas espere, 'updatePlayerStats' original usava 'user.uid'.
    // Se a ação é 'completou' ou 'recusou', é sobre o jogador da vez.

    const targetUid = sala?.jogadorAtual;
    if (!targetUid) return;

    try {
      const playerRef = doc(db, "salas", codigo, "jogadores", targetUid);
      const playerSnap = await getDoc(playerRef); // Precisamos ler os pontos atuais para validar min 0

      if (playerSnap.exists()) {
        const currentPoints = playerSnap.data().pontos || 0;
        let pointsChange = 0;

        if (action === "completou") pointsChange = 10;
        if (action === "recusou") pointsChange = -5;
        // Se for penalidade por tempo, pode ser tratado como recusou ou outro

        const newPoints = Math.max(0, currentPoints + pointsChange);

        const updates = {
          [`stats.${action}`]: increment(1),
          pontos: newPoints,
          ultimaAcao: serverTimestamp(),
        };

        // Se recusou, também conta como bebida
        if (action === "recusou") {
          updates["stats.bebidas"] = increment(1);
        }

        await updateDoc(playerRef, updates);

        if (pointsChange > 0) toast.success(`+${pointsChange} Pontos!`);
        if (pointsChange < 0) toast.error(`${pointsChange} Pontos!`);
      }
    } catch (error) {
      console.error("Erro ao atualizar stats do jogador:", error);
    }
  };

  if (!sala) {
    return <div className="text-white text-center p-8">Carregando jogo...</div>;
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
              jogadores={jogadores}
              onLeave={handleLeaveGame}
            />

            {sala.cartaAtual ? (
              <>
                <CardDisplay carta={sala.cartaAtual} timeLeft={timeLeft} />

                {/* Área de Votação (Amigos de Merda) */}
                {isVotingRound ? (
                  <div className="mt-6">
                    <VotingArea
                      jogadores={jogadores}
                      meuUid={meuUid}
                      onVote={handleVote}
                      votos={votos}
                      resultado={resultadoVotacao}
                    />

                    {/* Botão para avançar após resultado da votação (Apenas Jogador Atual ou ADM) */}
                    {resultadoVotacao && isCurrentPlayer && (
                      <div className="text-center mt-6">
                        <button
                          onClick={passarVez}
                          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold animate-bounce"
                        >
                          Próxima Rodada
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {sala.statusAcao === "aguardando_confirmacao" ? (
                      <div className="bg-yellow-600/20 border border-yellow-500/50 p-4 rounded-lg text-center animate-pulse">
                        <p className="text-lg font-bold text-yellow-400 mb-2">
                          Aguardando confirmação do Admin...
                        </p>
                        {/* Se eu sou o Host (Admin), mostro os botões de confirmar/rejeitar */}
                        {/* Nota: O Host pode ser o próprio jogador da vez, a regra diz "vale para ele também" */}
                        {jogadores.find((j) => j.uid === meuUid)?.isHost && (
                          <div className="flex justify-center gap-4 mt-4">
                            <button
                              onClick={handleAdminConfirm}
                              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-bold"
                            >
                              Confirmar (Cumpriu)
                            </button>
                            <button
                              onClick={handleAdminReject}
                              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-bold"
                            >
                              Rejeitar (Não Cumpriu)
                            </button>
                          </div>
                        )}
                      </div>
                    ) : sala.statusAcao === "aguardando_penalidade" ? (
                      <div className="bg-red-900/40 border border-red-500/50 p-4 rounded-lg text-center animate-pulse">
                        <p className="text-lg font-bold text-red-400 mb-2">
                          {isCurrentPlayer
                            ? "Aguardando Admin confirmar sua penalidade..."
                            : "O jogador desistiu!"}
                        </p>
                        <p className="text-sm text-gray-300 mb-4">
                          {isCurrentPlayer
                            ? "Prepare-se para beber!"
                            : "Confirme se ele bebeu para seguir o jogo."}
                        </p>

                        {jogadores.find((j) => j.uid === meuUid)?.isHost && (
                          <div className="flex justify-center gap-4 mt-4">
                            <button
                              onClick={handleAdminConfirmPenalty}
                              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-bold"
                            >
                              Confirmar (Bebeu)
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      showActions && (
                        <PlayerActions
                          onComplete={handleComplete}
                          onPenalidade={handlePenalidade}
                          cardType={sala.cartaAtual.tipo}
                        />
                      )
                    )}
                  </>
                )}

                <Timer timeLeft={timeLeft} totalTime={30} />
              </>
            ) : (
              <div className="text-center py-12">
                {isCurrentPlayer ? (
                  <button
                    onClick={handleSortearCarta}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-bold"
                  >
                    Sortear Carta
                  </button>
                ) : (
                  <p className="text-xl animate-pulse text-gray-300">
                    Aguardando{" "}
                    <span className="font-bold text-purple-400">
                      {jogadores.find((j) => j.uid === currentPlayer)?.nome ||
                        "o jogador"}
                    </span>{" "}
                    sortear uma carta...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RANKING DESKTOP */}
          <div className="hidden min-[1340px]:block fixed top-2 right-2 w-[250px] 2xl:w-[320px] transition-all duration-300">
            <h1 className="text-xl font-bold mb-2 text-center text-purple-300 drop-shadow-md !p-[3%]">
              Ranking
            </h1>
            <RankingJogadores jogadores={jogadores} meuUid={meuUid} />
          </div>
        </div>

        {/* RANKING MOBILE */}
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="min-[1340px]:hidden fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </button>

        {showRanking && (
          <div className="min-[1340px]:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm relative">
              <button
                onClick={() => setShowRanking(false)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-50 shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-bold mb-4 text-center text-white">
                Ranking
              </h2>
              <RankingJogadores jogadores={jogadores} meuUid={meuUid} />
            </div>
          </div>
        )}

        {showLeaveModal && (
          <ConfirmModal
            mensagem="Tem certeza que deseja sair da sala? Se você for o Host, a liderança será passada para outro jogador."
            onConfirm={confirmLeaveGame}
            onCancel={() => setShowLeaveModal(false)}
          />
        )}
      </div>
    </PageLayout>
  );
}
