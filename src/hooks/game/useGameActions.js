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
        sala.cartasUsadas || [],
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
        sala.cartasUsadas || [],
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

        if (event.id === "INVEJA") {
          // Gerar Máscara de Inveja (Shuffle)
          const profiles = jogadores.map((j) => ({
            nome: j.nome,
            avatar: j.avatar,
          }));

          // Fisher-Yates Shuffle
          for (let i = profiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [profiles[i], profiles[j]] = [profiles[j], profiles[i]];
          }

          const mask = {};
          jogadores.forEach((j, index) => {
            mask[j.uid] = profiles[index];
          });

          newEvent.mask = mask;
        }

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
        eu?.avatar,
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
    // if (!sala?.activeEvents) return; // Removed to allow init

    let newEvents = [...(sala.activeEvents || [])];
    const lustEventIndex = newEvents.findIndex(
      (e) => e.id === "LUXURIA" && e.owner === meuUid,
    );

    if (lustEventIndex === -1) {
      // Event doesn't exist yet, create it
      newEvents.push({
        id: "LUXURIA",
        name: "Luxúria - Pacto Proibido",
        icon: "💋",
        color: "bg-pink-600",
        duration: 99,
        owner: meuUid,
        linkedTo: targetUid,
        type: "PERSISTENT_EFFECT",
        createdAt: Date.now(),
      });
    } else {
      // Update existing
      newEvents[lustEventIndex] = {
        ...newEvents[lustEventIndex],
        linkedTo: targetUid,
      };
    }

    try {
      await updateDoc(doc(db, "salas", codigo), {
        activeEvents: newEvents,
        statusAcao: null,
      });
      toast.success("Alma VINCULADA! 💋");
      playSuccess();

      // Advance turn
      await updatePlayerStats("completou");
      await passarVez();
    } catch (error) {
      console.error("Erro ao vincular alma:", error);
      toast.error("Erro ao realizar pacto.");
    }
  };

  const resolveChaosVoting = async () => {
    if (!sala.activeEventState) return;

    const votes = Object.values(sala.activeEventState.votes || {});
    const safetyCount = votes.filter((v) => v === "SAFETY").length;
    const riskCount = votes.filter((v) => v === "RISK").length;

    // RULE: If Safety wins (Safety > Risk), everyone takes small damage.
    // If Risk wins (Risk >= Safety), we proceed to Coin Flip.
    if (safetyCount > riskCount) {
      await updateDoc(doc(db, "salas", codigo), {
        "activeEventState.phase": "RESULT_SAFETY",
      });

      // Apply Safety Effect: 5 DMG (1 Dose) to everyone
      const damages = jogadores.map((j) => takeDamage(j.uid, 5, false, false));
      await Promise.all(damages);

      toast("🍞 A maioria escolheu SEGURANÇA. Todos bebem 1 dose!", {
        icon: "🛡️",
        duration: 5000,
      });
      playFail();

      // End Event after delay
      setTimeout(async () => {
        await updatePlayerStats("completou");
        await updateDoc(doc(db, "salas", codigo), {
          activeEventState: deleteField(),
          statusAcao: null,
        });
        await passarVez();
      }, 5000);
    } else {
      // Risk Wins -> Proceed to Coin Flip Phase
      await updateDoc(doc(db, "salas", codigo), {
        "activeEventState.phase": "COIN_FLIP",
      });
      toast("🪙 O RISCO venceu! Preparem a moeda...", {
        icon: "😈",
        duration: 4000,
      });
      playFlip();
    }
  };

  const handleChaosVote = async (option) => {
    // Option: 'SAFETY' | 'RISK'
    try {
      const currentVotes = sala.activeEventState?.votes || {};
      const newVotes = { ...currentVotes, [meuUid]: option };

      await updateDoc(doc(db, "salas", codigo), {
        "activeEventState.votes": newVotes,
        "activeEventState.eventId": "GULA", // Ensure ID is set
        "activeEventState.phase": "VOTING",
      });

      // Check availability
      if (Object.keys(newVotes).length === jogadores.length) {
        await resolveChaosVoting();
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleCoinFlipResult = async (result, flipperUid) => {
    // result: 'HEADS' (Cara - Safe) | 'TAILS' (Coroa - 3 Doses)
    try {
      const currentFlips = sala.activeEventState?.flips || {};
      const newFlips = { ...currentFlips, [flipperUid]: result };

      const updates = {
        "activeEventState.flips": newFlips,
      };

      if (result === "TAILS") {
        // Player got Coroa -> Bebe 3 Doses (15 DMG)
        await takeDamage(flipperUid, 15, false, false);
        toast(
          `🪙 ${
            jogadores.find((j) => j.uid === flipperUid)?.nome
          } tirou COROA! ☠️ -15 HP`,
          { icon: "💀", duration: 5000 },
        );
      } else {
        toast(
          `🪙 ${
            jogadores.find((j) => j.uid === flipperUid)?.nome
          } tirou CARA! 😇 Salvo!`,
          { icon: "✨", duration: 4000 },
        );
      }

      await updateDoc(doc(db, "salas", codigo), updates);

      // Check if everyone has flipped
      if (Object.keys(newFlips).length === jogadores.length) {
        setTimeout(async () => {
          await updatePlayerStats("completou");
          await updateDoc(doc(db, "salas", codigo), {
            activeEventState: deleteField(),
            statusAcao: null,
          });
          await passarVez();
        }, 4000);
      }
    } catch (error) {
      console.error("Coin flip error:", error);
    }
  };

  const handleBanquet = async () => {
    // Legacy support or Init Voting?
    // Let's transform this into INIT VOTING
    await updateDoc(doc(db, "salas", codigo), {
      activeEventState: {
        eventId: "GULA",
        phase: "VOTING",
        votes: {},
      },
    });
  };

  const handleBetrayal = async () => {
    try {
      const lustEvent = sala.activeEvents?.find((e) => e.id === "LUXURIA");
      if (!lustEvent || !lustEvent.linkedTo) return;

      const { owner, linkedTo } = lustEvent;
      // Identify Partner
      const partnerUid = meuUid === owner ? linkedTo : owner;

      toast("💔 VOCÊ TRAIU O PACTO! Ambos sofrerão...", { icon: "🔪" });

      // 1. Dano Mútuo (10 HP)
      await takeDamage(meuUid, 10, false, false);
      await takeDamage(partnerUid, 10, false, false);

      // 2. Quebrar o Vínculo
      const newEvents = sala.activeEvents.map((e) => {
        if (e.id === "LUXURIA") {
          const { linkedTo, ...rest } = e;
          return rest;
        }
        return e;
      });

      await updateDoc(doc(db, "salas", codigo), {
        activeEvents: newEvents,
      });

      playSuccess();
    } catch (error) {
      console.error("Erro na traição:", error);
    }
  };

  const handleWrathSelection = async (targetUid1, targetUid2) => {
    try {
      if (!targetUid1 || !targetUid2) {
        toast.error("Selecione DOIS oponentes!");
        return;
      }

      await updateDoc(doc(db, "salas", codigo), {
        activeEventState: {
          eventId: "IRA",
          phase: "DUEL",
          targets: [targetUid1, targetUid2],
        },
      });
      toast.success("⚔️ O DUELO VAI COMEÇAR!", { icon: "🔥" });
    } catch (error) {
      console.error("Erro ao iniciar Duelo:", error);
    }
  };

  const handleWrathDecision = async (loserUid) => {
    try {
      const state = sala.activeEventState;
      if (!state || !state.targets.includes(loserUid)) return;

      const winnerUid = state.targets.find((uid) => uid !== loserUid);
      const winnerName = jogadores.find((j) => j.uid === winnerUid)?.nome;
      const loserName = jogadores.find((j) => j.uid === loserUid)?.nome;

      // PENALIDADES
      // Perdedor: Bebe em Dobro (Vamos assumir 2 doses = 10 dano base. Dobro = 20?)
      // A regra diz: "Quem perder, bebe em dobro" + "escolhe quem bebe mais 1 dose extra".
      // Vamos aplicar:
      // 1. Perdedor base: 2 Doses (standard duel cost? Rules say "bebe em dobro" implies double normal penalty). Normal is 1. So 2 doses.
      // 2. Extra dose chosen by judge: +1 Dose.
      // Total Loser Penalty: 3 Doses (15 HP)?
      // Or 2 Doses (Double) + 1 Extra = 3 Doses.

      await takeDamage(loserUid, 15, false, false); // 3 Doses

      toast(`💀 ${loserName} PERDEU e bebe 3 doses!`, {
        icon: "🩸",
        duration: 5000,
      });

      if (winnerName) {
        toast(`🏆 ${winnerName} VENCEU o duelo!`, {
          icon: "👑",
          duration: 5000,
        });
      }
      playSuccess();

      // Finalizar Carta
      setTimeout(async () => {
        await updatePlayerStats("completou");
        await updateDoc(doc(db, "salas", codigo), {
          activeEventState: deleteField(),
          statusAcao: null,
        });
        await passarVez();
      }, 3000);
    } catch (error) {
      console.error("Erro ao decidir Duelo:", error);
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
    handleWrathSelection,
    handleWrathDecision,
    handleBetrayal,
    handleChaosVote,
    handleCoinFlipResult,
  };
}
