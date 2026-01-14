import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  arrayUnion,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { sortearCarta, proximoJogador } from "../../firebase/game";
import {
  limparAcoesRodada,
  limparVotosRodada,
  sairDaSala,
  registrarAcaoRodada,
} from "../../firebase/rooms";
import { useSounds } from "../../hooks/useSounds";
import { CARD_TYPES, CATEGORIES } from "../../constants/constants";
import { useRPG } from "./useRPG";

export function useGameActions(codigo, sala, jogadores, meuUid, setTimeLeft) {
  const { playFlip, playSuccess, playFail, playPodium } = useSounds();
  const { takeDamage, heal, useAbility } = useRPG(codigo, sala);

  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [choiceTimeLeft, setChoiceTimeLeft] = useState(10);
  const [actionTaken, setActionTaken] = useState(false);
  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState(false);

  const [acoesRodada, setAcoesRodada] = useState({});
  const isNeverRound = sala?.cartaAtual?.tipo === CARD_TYPES.NEVER;

  const currentPlayer = sala?.jogadorAtual;
  const isCurrentPlayer = currentPlayer === meuUid;
  const isVotingRound = sala?.cartaAtual?.tipo === CARD_TYPES.FRIENDS;

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

  // --- ACTIONS ---

  const handleSortearCarta = async () => {
    if (!isCurrentPlayer || !sala) return;

    try {
      const categorias =
        sala.categorias && sala.categorias.length > 0
          ? sala.categorias
          : Object.values(CATEGORIES);

      const { carta: tempCarta, reset } = await sortearCarta(
        sala.modo,
        categorias,
        null,
        sala.cartasUsadas || []
      );

      if (reset) {
        toast("Baralho reembaralhado! 🔄", { icon: "🃏" });
        await updateDoc(doc(db, "salas", codigo), { cartasUsadas: [] });
      }

      if (
        tempCarta.categoria === CATEGORIES.TRUTH_OR_DARE ||
        tempCarta.tipo === CARD_TYPES.TRUTH ||
        tempCarta.tipo === CARD_TYPES.DARE
      ) {
        setShowChoiceModal(true);
        setChoiceTimeLeft(10);
        return;
      }

      // Check for Blitz Mode (GREED)
      const isBlitz = sala.activeEvents?.some((e) => e.id === "GANANCIA");
      const isSloth = sala.activeEvents?.some((e) => e.id === "PREGUICA");

      let timeToSet = 30;
      if (isBlitz) timeToSet = 10;
      if (isSloth) timeToSet = 60; // Sloth overrides everything with laziness

      await updateDoc(doc(db, "salas", codigo), {
        cartaAtual: tempCarta,
        timeLeft: timeToSet,
        cartasUsadas: reset ? [tempCarta.id] : arrayUnion(tempCarta.id),
      });
      if (setTimeLeft) setTimeLeft(timeToSet);
      setActionTaken(false);
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

      const { carta, reset } = await sortearCarta(
        sala.modo,
        categorias,
        tipoEscolhido,
        sala.cartasUsadas || []
      );

      // Check for Blitz Mode (GREED)
      const isBlitz = sala.activeEvents?.some((e) => e.id === "GANANCIA");
      const timeToSet = isBlitz ? 10 : 30;

      const updates = {
        cartaAtual: carta,
        timeLeft: timeToSet,
        cartasUsadas: reset ? [carta.id] : arrayUnion(carta.id),
      };

      if (reset) {
        toast("Baralho reembaralhado! 🔄", { icon: "🃏" });
      }

      await updateDoc(doc(db, "salas", codigo), updates);
      if (setTimeLeft) setTimeLeft(timeToSet);
      setActionTaken(false);
      playFlip();
    } catch (error) {
      console.error("Erro ao sortear carta:", error);
      toast.error("Erro ao sortear carta. Tente novamente.");
    }
  };

  const passarVez = async (overrideUpdates = {}) => {
    try {
      let proximoUid;

      // Verifica se o Estrategista definiu o próximo
      if (sala.nextPlayerOverride) {
        proximoUid = sala.nextPlayerOverride;
      } else {
        proximoUid = await proximoJogador(codigo, currentPlayer);
      }

      const updates = {
        jogadorAtual: proximoUid,
        cartaAtual: null,
        timeLeft: 30,
        statusAcao: null,
        ...overrideUpdates,
      };

      // Se usou override, limpa
      if (sala.nextPlayerOverride) {
        updates.nextPlayerOverride = deleteField();
      }

      // Se tinha punição dobrada (Incendiária), limpa ao passar a vez
      if (sala.config?.punicaoDobrada) {
        updates["config.punicaoDobrada"] = deleteField();
      }

      if (isVotingRound) await limparVotosRodada(codigo);
      await limparAcoesRodada(codigo);

      // Decrement chaos events duration
      // Use override activeEvents if available, else current state
      const currentEvents = overrideUpdates.activeEvents || sala.activeEvents;

      if (currentEvents && currentEvents.length > 0) {
        const updatedEvents = currentEvents
          .map((ev) => ({ ...ev, duration: ev.duration - 1 }))
          .filter((ev) => ev.duration > 0);

        updates.activeEvents = updatedEvents;

        if (updatedEvents.length < currentEvents.length) {
          toast("Um Evento do Caos expirou!", { icon: "🕊️" });
        }
      }

      await updateDoc(doc(db, "salas", codigo), updates);
      setActionTaken(false);
    } catch (error) {
      console.error("Erro ao passar a vez:", error);
    }
  };

  const updatePlayerStats = async (action) => {
    const targetUid = sala?.jogadorAtual;
    if (!targetUid) return;

    try {
      const playerRef = doc(db, "salas", codigo, "jogadores", targetUid);
      const playerSnap = await getDoc(playerRef);

      if (playerSnap.exists()) {
        const currentPoints = playerSnap.data().pontos || 0;
        let pointsChange = 0;

        if (action === "completou") pointsChange = 10;
        if (action === "recusou") pointsChange = -5;

        const newPoints = Math.max(0, currentPoints + pointsChange);

        const updates = {
          [`stats.${action}`]: increment(1),
          pontos: newPoints,
          ultimaAcao: serverTimestamp(),
        };

        if (action === "recusou") {
          updates["stats.bebidas"] = increment(1);
          // RPG: Recusar causa dano! (5 HP base)
          // Se Incendiária ativou, dobra o dano base.
          const baseDamage = sala.config?.punicaoDobrada ? 10 : 5;
          await takeDamage(targetUid, baseDamage);
        }

        await updateDoc(playerRef, updates);

        if (pointsChange > 0) toast.success(`+${pointsChange} Pontos!`);
        if (pointsChange < 0) toast.error(`${pointsChange} Pontos!`);
      }
    } catch (error) {
      console.error("Erro ao atualizar stats do jogador:", error);
    }
  };

  const resetGameData = async (newStatus) => {
    try {
      await updateDoc(doc(db, "salas", codigo), {
        status: newStatus,
        estado: newStatus === "waiting" ? "waiting" : "ongoing",
        cartaAtual: null,
        cartasUsadas: [],
        activeEvents: [], // Limpa eventos do caos
        "config.comecouEm": serverTimestamp(),
      });

      const jogadoresRef = collection(db, "salas", codigo, "jogadores");
      const snapshot = await getDocs(jogadoresRef);

      const resetPromises = snapshot.docs.map((playerDoc) => {
        return updateDoc(playerDoc.ref, {
          pontos: 0,
          hp: 30,
          maxHp: 30,
          isCritical: false,
          "stats.bebeu": 0,
          "stats.recusou": 0,
          "stats.cumpriu": 0,
          "stats.euJa": 0,
          "stats.euNunca": 0,
          ultimaAcao: serverTimestamp(),
        });
      });

      await Promise.all(resetPromises);

      if (newStatus === "playing") {
        const uids = snapshot.docs.map((d) => d.id);
        const novoJogador = uids[Math.floor(Math.random() * uids.length)];
        await updateDoc(doc(db, "salas", codigo), {
          jogadorAtual: novoJogador,
          estado: "playing",
        });
      }
    } catch (error) {
      console.error("Erro ao resetar dados do jogo:", error);
      throw error;
    }
  };

  const handleFinishGame = async () => {
    try {
      await updateDoc(doc(db, "salas", codigo), {
        status: "completed",
      });
      playPodium();
      setShowFinishConfirmModal(false);
    } catch (error) {
      console.error("Erro ao finalizar jogo:", error);
      toast.error("Erro ao finalizar jogo.");
    }
  };

  // --- Fluxo de Confirmação (Admin) ---
  const handleComplete = async () => {
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

    let extraUpdates = {};

    // Check for Chaos Event
    if (sala?.cartaAtual?.tipo === "CAOS") {
      const event = sala.cartaAtual;

      if (
        event.type === "GLOBAL_EFFECT" ||
        event.type === "PERSISTENT_EFFECT"
      ) {
        const newEvent = {
          ...event,
          startedAt: Date.now(),
          owner: sala.jogadorAtual,
        };

        // Pass new list to passarVez to avoid stale state overwrite
        const currentEvents = sala.activeEvents || [];
        extraUpdates.activeEvents = [...currentEvents, newEvent];

        toast.success(`Evento ${event.name} ATIVADO!`);
      }
      // Immediate actions don't need persistence, just execution (which is manual for now)
    }

    await updatePlayerStats("completou");
    await updateDoc(doc(db, "salas", codigo), { statusAcao: null }); // Limpa status

    // Pass extra updates (Chaos Events) to PasarVez
    await passarVez(extraUpdates);
  };

  const handleAdminReject = async () => {
    playFail();
    await updatePlayerStats("recusou"); // Conta como recusa/falha
    await updateDoc(doc(db, "salas", codigo), { statusAcao: null }); // Limpa status
    await passarVez();
  };

  const handlePenalidade = async () => {
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

  // --- Handlers para Eu Nunca / Ações ---
  const handleEuJa = async () => {
    try {
      const playerRef = doc(db, "salas", codigo, "jogadores", meuUid);
      await updateDoc(playerRef, {
        "stats.bebidas": increment(1),
        "stats.euJa": increment(1),
        ultimaAcao: serverTimestamp(),
      });

      const eu = jogadores.find((j) => j.uid === meuUid);
      await registrarAcaoRodada(codigo, meuUid, "EU_JA", eu?.nome, eu?.avatar);

      toast("Você bebeu!", { icon: "🍺" });
      playSuccess();
    } catch (error) {
      console.error("Erro ao registrar Eu Já:", error);
    }
  };

  const handleEuNunca = async () => {
    try {
      const eu = jogadores.find((j) => j.uid === meuUid);
      await registrarAcaoRodada(
        codigo,
        meuUid,
        "EU_NUNCA",
        eu?.nome,
        eu?.avatar
      );
      toast.success("😇 Salvo!");
    } catch (error) {
      console.error("Erro ao registrar Eu Nunca:", error);
    }
  };

  const handleMultar = async (targetUid) => {
    try {
      // Multa padrão: 5 de dano (1 drink)
      await takeDamage(targetUid, 5);
      toast.success("Multa aplicada! 👮‍♂️");
      playSuccess(); // Or a custom sound?
    } catch (error) {
      console.error("Erro ao multar:", error);
      toast.error("Erro ao aplicar multa.");
    }
  };

  const handleLinkSoul = async (targetUid) => {
    if (!sala?.activeEvents) return;

    const lustEventIndex = sala.activeEvents.findIndex(
      (e) => e.id === "LUXURIA" && e.owner === meuUid
    );
    if (lustEventIndex === -1) return;

    const newEvents = [...sala.activeEvents];
    newEvents[lustEventIndex] = {
      ...newEvents[lustEventIndex],
      linkedTo: targetUid,
    };

    try {
      await updateDoc(doc(db, "salas", codigo), { activeEvents: newEvents });
      toast.success("Alma VINCULADA! 💋");
      playSuccess();
    } catch (error) {
      console.error("Erro ao vincular alma:", error);
      toast.error("Erro ao realizar pacto.");
    }
  };

  const handleBanquet = async () => {
    try {
      // Gula: Todos tomam 5 de dano (Simulando "todos bebem")
      const damages = jogadores.map((j) => takeDamage(j.uid, 5, false, false)); // false propagate to avoid loop chaos here
      await Promise.all(damages);

      toast.success("🍔 BANQUETE TÓXICO SERVIDO! Todos bebem!", {
        duration: 4000,
      });
      playSuccess();

      // Gula completa a rodada
      await updatePlayerStats("completou");
      await updateDoc(doc(db, "salas", codigo), { statusAcao: null });
      await passarVez();
    } catch (error) {
      console.error("Erro no banquete:", error);
    }
  };

  const handleDuel = async (targetUid1, targetUid2) => {
    try {
      const p1 = jogadores.find((j) => j.uid === targetUid1)?.nome || "P1";
      const p2 = jogadores.find((j) => j.uid === targetUid2)?.nome || "P2";

      toast(`⚔️ DUELO INICIADO: ${p1} vs ${p2}!`, {
        icon: "😠",
        duration: 5000,
      });
      playSuccess();

      // Ira completa a rodada
      await updatePlayerStats("completou");
      await updateDoc(doc(db, "salas", codigo), { statusAcao: null });
      await passarVez();
    } catch (error) {
      console.error("Erro no duelo:", error);
    }
  };

  return {
    handleSortearCarta,
    handleChoice,
    passarVez,
    updatePlayerStats,
    resetGameData,
    handleFinishGame,
    handleEuJa,
    handleEuNunca,
    handleComplete,
    handleAdminConfirm,
    handleAdminReject,
    handlePenalidade,
    handleAdminConfirmPenalty,
    handleAdminConfirmPenalty,
    acoesRodada,
    showChoiceModal,
    setShowChoiceModal,
    choiceTimeLeft,
    setChoiceTimeLeft,
    actionTaken,
    setActionTaken,
    showFinishConfirmModal,
    setShowFinishConfirmModal,
    handleUseAbility: useAbility,
    handleMultar,
    handleLinkSoul,
    handleBanquet,
    handleDuel,
  };
}
