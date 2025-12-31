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
  arrayUnion,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { sortearCarta, proximoJogador, submitVote } from "../firebase/game";
import { sairDaSala, registrarAcaoRodada, limparAcoesRodada, registrarVoto, limparVotosRodada } from "../firebase/rooms";
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
import PowerUpBar from "../components/game/PowerUpBar"; // IMPORTADO
import { CARD_TYPES, CATEGORIES } from "../constants/constants";
import { useSounds } from "../hooks/useSounds";
import { Volume2, VolumeX, Skull } from "lucide-react"; // ícones de som e kill

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
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [choiceTimeLeft, setChoiceTimeLeft] = useState(10);
  const [showForceModal, setShowForceModal] = useState(null); // null, 'VOTE', 'NEVER'
  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState(false);

  // Estados para Power-ups
  const [showRevengeSelector, setShowRevengeSelector] = useState(false);

  // Estados para Votação (Amigos de Merda)
  const [votos, setVotos] = useState({});
  const [resultadoVotacao, setResultadoVotacao] = useState(null);
  const [acoesRodada, setAcoesRodada] = useState({});

  const meuUid = user?.uid;
  const currentPlayer = sala?.jogadorAtual;
  const isCurrentPlayer = currentPlayer === meuUid;
  
  // Obter dados do meu jogador (para inventário de powerups)
  const meuJogador = jogadores.find(j => j.uid === meuUid);
  
  // Se for votação, todos podem agir (votar), não só o jogador da vez


  // Se for votação, todos podem agir (votar), não só o jogador da vez
  const isVotingRound = sala?.cartaAtual?.tipo === CARD_TYPES.FRIENDS;
  const isNeverRound = sala?.cartaAtual?.tipo === CARD_TYPES.NEVER;
  const showVotingArea = isVotingRound && !resultadoVotacao;
  
  // No Eu Nunca, todos veem as ações. Nos outros, só o jogador da vez.
  const showActions = (isCurrentPlayer || isNeverRound) && !actionTaken && sala?.cartaAtual;
  const {
    playJogo,
    stopJogo,
    toggleMusic,
    playingBgMusic,
    playFlip,
    playSuccess,
    playPodium,
    playFail,
    playClown,
    playSair
  } = useSounds();

  useEffect(() => {
    // Toca música se não estiver completado
    if (sala?.status === "completed") {
        stopJogo();
    } else {
        playJogo();
    }
    
    return () => stopJogo(); 
  }, [sala?.status]);

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

        // Redirecionar para o Lobby se o estado for 'waiting'
        if (data.status === "waiting" || data.estado === "waiting") {
          navigate(`/lobby/${codigo}`);
        }
      } else {
        navigate("/");
      }
    });
    return () => unsub();
  }, [codigo, navigate]);

  // Listener de Jogadores
  const prevJogadoresRef = React.useRef([]);

  useEffect(() => {
    if (!codigo) return;
    const q = collection(db, "salas", codigo, "jogadores");
    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      // Detectar quem saiu
      if (prevJogadoresRef.current.length > 0) {
        const currentUids = lista.map((p) => p.uid);
        const saiu = prevJogadoresRef.current.filter(
          (p) => !currentUids.includes(p.uid)
        );
        saiu.forEach((p) => {
          toast.error(`${p.nome} saiu da sala.`);
          playSair();
        });
      }

      prevJogadoresRef.current = lista;
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
        novosVotos[doc.id] = doc.data().alvo;
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

  // Listener de Ações da Rodada (Eu Nunca)
  useEffect(() => {
    if (!codigo || !isNeverRound) return;

    const q = collection(db, "salas", codigo, "acoes");
    const unsub = onSnapshot(q, (snapshot) => {
      const novasAcoes = {};
      snapshot.docs.forEach((doc) => {
        novasAcoes[doc.id] = doc.data();
      });
      setAcoesRodada(novasAcoes);
    });

    return () => unsub();
  }, [codigo, isNeverRound]);

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

    // Encontrar o(s) mais votado(s) - Empate
    let maxVotos = -1;
    let perdedores = [];

    Object.entries(contagem).forEach(([uid, count]) => {
      if (count > maxVotos) {
        maxVotos = count;
        perdedores = [uid];
      } else if (count === maxVotos) {
        perdedores.push(uid);
      }
    });

    if (perdedores.length > 0) {
      setResultadoVotacao({ perdedores, totalVotos: maxVotos });
      playClown();

      // Apenas o Host ou Jogador Atual aplica a penalidade para evitar duplicidade
      if (isCurrentPlayer || jogadores.find(j => j.uid === meuUid)?.isHost) {
         // Penalidade para o mais votado
        const batchUpdates = perdedores.map(async (uid) => {
          const playerRef = doc(db, "salas", codigo, "jogadores", uid);
          await updateDoc(playerRef, {
            "stats.bebeu": increment(1), // Exemplo de penalidade
            ultimaAcao: serverTimestamp(),
          });
        });
        
        await Promise.all(batchUpdates);
      }
    }
  };

  // Timer da Escolha (Local)
  useEffect(() => {
    if (showChoiceModal && choiceTimeLeft > 0) {
      const timer = setTimeout(() => setChoiceTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showChoiceModal && choiceTimeLeft === 0) {
      // Tempo acabou: escolha aleatória
      const randomType = Math.random() > 0.5 ? CARD_TYPES.TRUTH : CARD_TYPES.DARE;
      handleChoice(randomType);
    }
  }, [showChoiceModal, choiceTimeLeft]);

  const handleSortearCarta = async () => {
    if (!isCurrentPlayer || !sala) return;

    try {
      const categorias =
        sala.categorias && sala.categorias.length > 0
          ? sala.categorias
          : Object.values(CATEGORIES);

      // 1. Sorteamos uma carta "provisória" para definir o TIPO da rodada
      // Isso garante que em modos mistos (ex: Normal), a chance de cair Verdade/Desafio 
      // ou "Eu Nunca" segue a proporção real do banco de dados.
      const { carta: tempCarta, reset } = await sortearCarta(
        sala.modo, 
        categorias, 
        null, 
        sala.cartasUsadas || []
      );
      
      // Se houve reset, notificamos e atualizamos o histórico
      if (reset) {
        toast("Baralho reembaralhado! 🔄", { icon: "🃏" });
        await updateDoc(doc(db, "salas", codigo), { cartasUsadas: [] });
      }

      // 2. Se a carta sorteada for do tipo Verdade ou Desafio, abrimos o Modal de Escolha
      // A carta provisória é descartada (mas teoricamente "gasta" do sorteio, porém como é provisória não salvaremos ainda no histórico se for descartada. Salvemos apenas a FINAL).
      // OBS: Se a carta for descartada aqui, ela NÃO deve entrar no histórico.
      
      if (tempCarta.categoria === CATEGORIES.TRUTH_OR_DARE || 
          tempCarta.tipo === CARD_TYPES.TRUTH || 
          tempCarta.tipo === CARD_TYPES.DARE) {
        
        setShowChoiceModal(true);
        setChoiceTimeLeft(10);
        return;
      }

      // 3. Se for outro tipo (Eu Nunca, Amigos de Merda, etc), exibimos direto
      await updateDoc(doc(db, "salas", codigo), {
        cartaAtual: tempCarta,
        timeLeft: 30,
        // Adiciona ao histórico
         cartasUsadas: reset ? [tempCarta.id] : arrayUnion(tempCarta.id)
      });
      setTimeLeft(30);
      setActionTaken(false);
      setResultadoVotacao(null);
      playFlip();

    } catch (error) {
      console.error("Erro ao sortear carta preliminar:", error);
      toast.error("Erro ao iniciar rodada.");
    }
  };

  const handleChoice = async (tipoEscolhido = null) => {
    setShowChoiceModal(false);
    
    try {
      const categorias =
        sala.categorias && sala.categorias.length > 0
          ? sala.categorias
          : Object.values(CATEGORIES);
      
      // Passamos o tipoEscolhido para sortearCarta
      const { carta, reset } = await sortearCarta(
        sala.modo, 
        categorias, 
        tipoEscolhido, 
        sala.cartasUsadas || []
      );
      
      const updates = {
        cartaAtual: carta,
        timeLeft: 30,
        cartasUsadas: reset ? [carta.id] : arrayUnion(carta.id)
      };

      if (reset) {
         toast("Baralho reembaralhado! 🔄", { icon: "🃏" });
      }
      
      await updateDoc(doc(db, "salas", codigo), updates);
      setTimeLeft(30);
      setActionTaken(false);
      setResultadoVotacao(null);
      playFlip();
    } catch (error) {
      console.error("Erro ao sortear carta:", error);
      toast.error("Erro ao sortear carta. Tente novamente.");
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
    playSuccess();
    await updatePlayerStats("completou");
    await updateDoc(doc(db, "salas", codigo), { statusAcao: null }); // Limpa status
    await passarVez();
  };

  const handleAdminReject = async () => {
    playFail();
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
    playFail();
    await updatePlayerStats("recusou"); // Aplica penalidade e conta bebida
    await updateDoc(doc(db, "salas", codigo), { statusAcao: null }); // Limpa status
    await passarVez();
  };

  const handleEuJa = async () => {
    try {
      // 1. Incrementa stats
      const playerRef = doc(db, "salas", codigo, "jogadores", meuUid);
      await updateDoc(playerRef, {
        "stats.bebidas": increment(1),
        "stats.euJa": increment(1),
        ultimaAcao: serverTimestamp(),
      });
      
      // 2. Registra ação visual para todos verem
      const eu = jogadores.find(j => j.uid === meuUid);
      await registrarAcaoRodada(codigo, meuUid, "EU_JA", eu?.nome, eu?.avatar);
      
      await registrarAcaoRodada(codigo, meuUid, "EU_JA", eu?.nome, eu?.avatar);
      
      toast("Você bebeu!", { icon: "🍺" });
      playSuccess(); // ou playFail? Eu já bebe, então é meio fail kkk mas vamos de success pelo "evento"
    } catch (error) {
      console.error("Erro ao registrar Eu Já:", error);
    }
  };

  const handleEuNunca = async () => {
    try {
      const eu = jogadores.find(j => j.uid === meuUid);
      await registrarAcaoRodada(codigo, meuUid, "EU_NUNCA", eu?.nome, eu?.avatar);
      toast.success("😇 Salvo!");
    } catch (error) {
      console.error("Erro ao registrar Eu Nunca:", error);
    }
  };

  const handleVote = async (targetUid) => {
    try {
      await registrarVoto(codigo, user.uid, targetUid);
      toast.success("Voto registrado!");
    } catch (error) {
      console.error("Erro ao votar:", error);
      toast.error("Erro ao registrar voto.");
    }
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

  const handleFinishGame = async () => {
    try {
      await updateDoc(doc(db, "salas", codigo), {
        status: "completed",
      });
      playPodium(); // Musicão de vitória
      setShowFinishConfirmModal(false);
    } catch (error) {
      console.error("Erro ao finalizar jogo:", error);
      toast.error("Erro ao finalizar jogo.");
    }
  };

  // --- POWER UPS ---

  const handleUseShield = async () => {
    try {
      if (!meuJogador?.powerups?.shield) return;

      // Consumir escudo
      await updateDoc(doc(db, "salas", codigo, "jogadores", meuUid), {
        "powerups.shield": increment(-1),
        ultimaAcao: serverTimestamp()
      });

      toast.success("🛡️ ESCUDO ATIVADO! Pulando a vez...", {
        style: { background: '#1e3a8a', color: '#fff' }
      });
      
      playSuccess(); // Somzinho de buff
      await passarVez(); // Pula a vez sem penalidade

    } catch (error) {
      console.error("Erro ao usar escudo:", error);
      toast.error("Falha ao ativar escudo.");
    }
  };

  const handleUseSwap = async () => {
    try {
      if (!meuJogador?.powerups?.swap) return;

      // Consumir troca
      await updateDoc(doc(db, "salas", codigo, "jogadores", meuUid), {
        "powerups.swap": increment(-1),
        ultimaAcao: serverTimestamp()
      });

      toast("🔄 TROCA! Ressorteando carta...", {
        icon: "🔄"
      });

      // Ressortear
      await handleSortearCarta();

    } catch (error) {
      console.error("Erro ao usar troca:", error);
      toast.error("Falha ao usar troca.");
    }
  };

  const handleUseRevenge = () => {
    if (!meuJogador?.powerups?.revenge) return;
    setShowRevengeSelector(true);
  };

  const handleConfirmRevenge = async (targetUid) => {
    try {
      setShowRevengeSelector(false);
      
      // Consumir vingança
      await updateDoc(doc(db, "salas", codigo, "jogadores", meuUid), {
        "powerups.revenge": increment(-1),
        ultimaAcao: serverTimestamp()
      });

      // Aplicar penalidade no alvo
      const targetRef = doc(db, "salas", codigo, "jogadores", targetUid);
      const targetName = jogadores.find(j => j.uid === targetUid)?.nome || "Alvo";

      await updateDoc(targetRef, {
        "stats.bebidas": increment(1),
        "stats.recusou": increment(1) // Opcional: contar como recusa? Melhor só bebida extra.
        // Vamos contar apenas bebida por enquanto para ser "ataque"
      });
      
      toast.success(`😈 VINGANÇA! ${targetName} vai beber!`, {
        icon: "⚡",
        style: { background: '#7f1d1d', color: '#fff' }
      });

      playClown(); // Som zoado para a vítima

    } catch (error) {
      console.error("Erro ao usar vingança:", error);
      toast.error("Falha ao usar vingança.");
    }
  };

  const resetGameData = async (newStatus) => {
    try {
      // 1. Resetar Sala
      await updateDoc(doc(db, "salas", codigo), {
        status: newStatus,
        estado: newStatus === "waiting" ? "waiting" : "ongoing", // Mantendo consistência com Legacy (rooms.js)
        cartaAtual: null,
        cartasUsadas: [], // Reseta o histórico de cartas
        // Opcional: manter categorias e config
        "config.comecouEm": serverTimestamp(),
      });

      // 2. Resetar Stats de TODOS os jogadores
      // Como não podemos fazer batch update em coleção inteira de uma vez sem ler,
      // vamos ler e fazer um batch ou promise.all
      const jogadoresRef = collection(db, "salas", codigo, "jogadores");
      const snapshot = await getDocs(jogadoresRef);
      
      const resetPromises = snapshot.docs.map(playerDoc => {
        return updateDoc(playerDoc.ref, {
          pontos: 0,
          "stats.bebeu": 0,
          "stats.recusou": 0,
          "stats.cumpriu": 0,
          "stats.euJa": 0,
          "stats.euNunca": 0, // Se tiver esse stat
          ultimaAcao: serverTimestamp()
        });
      });

      await Promise.all(resetPromises);
      
      // 3. Se for 'playing' (Novo Jogo), sortear novo jogador
      if (newStatus === "playing") {
        const uids = snapshot.docs.map(d => d.id);
        const novoJogador = uids[Math.floor(Math.random() * uids.length)];
        await updateDoc(doc(db, "salas", codigo), {
          jogadorAtual: novoJogador,
          estado: "playing" // Garantindo consistência se usar 'estado' ou 'status' (seu código usa 'status' em Jogo.jsx mas rooms.js usa 'estado'. Vamos manter 'status' por enquanto se é o que Jogo.jsx usa, ou corrigir. O código original de rooms.js usa 'estado'. Jogo.jsx usa 'sala.status'?)
          // Verificando Jogo.jsx atual... ele usa 'sala.status' no handleFinishGame e Podium check.
          // Mas rooms.js usa 'estado'. Isso é uma inconsistência latente.
          // Vamos setar AMBOS para garantir.
        });
      }

    } catch (error) {
      console.error("Erro ao resetar dados do jogo:", error);
      throw error;
    }
  };

  const handleRestartGame = async () => {
    try {
        await resetGameData("playing"); // Ou 'ongoing' se for o enum
        toast.success("Novo Jogo Iniciado!");
    } catch(e) {
        toast.error("Erro ao reiniciar jogo.");
    }
  };

  const handleBackToLobby = async () => {
    try {
      await resetGameData("waiting");
    } catch (error) {
       toast.error("Erro ao voltar ao lobby.");
    }
  };

  const passarVez = async () => {
    try {
      const proximoUid = await proximoJogador(codigo, currentPlayer);

      // Limpar votos se houve votação
      if (isVotingRound) {
        await limparVotosRodada(codigo);
      }

      // Limpar ações da rodada (Eu Nunca)
      await limparAcoesRodada(codigo);

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

  // Se o jogo acabou, mostra o Pódio
  if (sala.status === "completed") {
    return (
      <Podium 
        jogadores={jogadores} 
        onBackToLobby={handleBackToLobby} 
        onRestart={handleRestartGame} 
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
              jogadores={jogadores}
              onLeave={handleLeaveGame}
              isHost={jogadores.find(j => j.uid === meuUid)?.isHost}
              onFinishGame={() => setShowFinishConfirmModal(true)}
            />

            {sala.cartaAtual ? (
              <>
                <CardDisplay carta={sala.cartaAtual} timeLeft={timeLeft} />


                {/* Visualizar Power-ups (Apenas Jogador Atual e se não tiver feito ação) */}
                {isCurrentPlayer && !actionTaken && !isVotingRound && !isNeverRound && (
                  <PowerUpBar 
                    powerups={meuJogador?.powerups}
                    onUse={(type) => {
                        if (type === 'shield') handleUseShield();
                        if (type === 'swap') handleUseSwap();
                        if (type === 'revenge') handleUseRevenge();
                    }}
                    disabled={resultadoVotacao || sala.statusAcao}
                  />
                )}

                {/* Modal de Seleção de Vingança */}
                {showRevengeSelector && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-red-500 rounded-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                            <Skull size={24} />
                            ESCOLHA SUA VÍTIMA
                        </h3>
                        <p className="text-gray-300 mb-6 text-sm">Quem vai beber no seu lugar? 😈</p>
                        
                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                            {jogadores.filter(j => j.uid !== meuUid).map(j => (
                                <button
                                    key={j.uid}
                                    onClick={() => handleConfirmRevenge(j.uid)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-red-900/40 border border-gray-700 hover:border-red-500 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                        {j.avatar?.startsWith("http") ? (
                                            <img src={j.avatar} alt={j.nome} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="w-full h-full flex items-center justify-center text-lg">{j.avatar}</span>
                                        )}
                                    </div>
                                    <span className="font-bold text-gray-200 group-hover:text-red-200 truncate">{j.nome}</span>
                                </button>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => setShowRevengeSelector(false)}
                            className="mt-6 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                  </div>
                )}

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

                    {/* Feedback de Progresso da Votação */}
                    {!resultadoVotacao && (
                      <div className="flex flex-col items-center justify-center mt-6 gap-3">
                        <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-500/30 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse">
                          <p className="text-purple-200 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                            Aguardando Votos: <span className="text-white text-lg">{Object.keys(votos).length}</span> / {jogadores.length}
                          </p>
                        </div>
                        
                        {/* Botão de Forçar Resultado (Apenas Host) */}
                        {jogadores.find(j => j.uid === meuUid)?.isHost && Object.keys(votos).length > 0 && (
                          <button 
                            onClick={() => setShowForceModal({ type: 'VOTE' })}
                            className="group flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/20"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Forçar Encerramento
                          </button>
                        )}
                      </div>
                    )}

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
                          onEuJa={handleEuJa}
                          onEuNunca={handleEuNunca}
                          cardType={sala.cartaAtual.tipo}
                        />
                      )
                    )}

                    {/* Botão de Próxima Rodada para Eu Nunca (Apenas Jogador Atual ou Admin) */}
                    {isNeverRound && (
                      <>
                        <PlayerStatusGrid jogadores={jogadores} acoes={acoesRodada} />
                        
                        {(isCurrentPlayer || jogadores.find(j => j.uid === meuUid)?.isHost) && (
                          <div className="text-center mt-6">
                            {Object.keys(acoesRodada).length === jogadores.length ? (
                                <button
                                  onClick={passarVez}
                                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-white shadow-lg shadow-purple-900/30 transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                                >
                                  <span>Próxima Rodada</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="px-6 py-3 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl flex items-center gap-3 text-slate-400 cursor-wait">
                                      <div className="flex space-x-1">
                                         <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                         <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                         <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                      </div>
                                      <span className="font-medium text-sm">Aguardando ({Object.keys(acoesRodada).length}/{jogadores.length})</span>
                                    </div>
                                    
                                    {jogadores.find(j => j.uid === meuUid)?.isHost && (
                                        <button 
                                            onClick={() => setShowForceModal({ type: 'NEVER' })}
                                            className="group flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            Forçar Próxima Rodada
                                        </button>
                                    )}
                                </div>
                            )}
                          </div>
                        )}
                      </>
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

        {showForceModal && (
            <ConfirmModal
                mensagem={
                    showForceModal.type === 'VOTE' 
                    ? "Alguns jogadores não votaram. Deseja encerrar a votação e calcular o resultado com os votos atuais?" 
                    : "Alguns jogadores não interagiram. Deseja forçar o fim do Eu Nunca?"
                }
                onConfirm={() => {
                    if (showForceModal.type === 'VOTE') {
                        calcularResultadoVotacao(votos);
                    } else {
                        passarVez();
                    }
                    setShowForceModal(null);
                }}
                onCancel={() => setShowForceModal(null)}
            />
        )}

        {showFinishConfirmModal && (
          <ConfirmModal
            mensagem="Tem certeza que deseja encerrar o jogo agora? Todos serão levados para o Pódio."
            onConfirm={handleFinishGame}
            onCancel={() => setShowFinishConfirmModal(false)}
          />
        )}
        
        {showChoiceModal && (
          <ChoiceModal 
            onChoice={handleChoice} 
            timeLeft={choiceTimeLeft} 
          />
        )}

          {/* BOTÃO DE MÚSICA */}
          <button
            onClick={() => toggleMusic("musicaJogo")}
            className="fixed bottom-5 left-5 bg-black/50 backdrop-blur-sm border border-orange-400 text-white p-3 rounded-full shadow-lg hover:scale-110 hover:bg-black/70 transition-transform duration-200"
            title={playingBgMusic === "musicaJogo" ? "Parar música" : "Tocar música"}
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
