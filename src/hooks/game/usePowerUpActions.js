import { useState } from "react";
import { doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { useSounds } from "../../hooks/useSounds";

export function usePowerUpActions(codigo, meuUid, meuJogador, jogadores, actions) {
  const [showRevengeSelector, setShowRevengeSelector] = useState(false);
  const { playSuccess, playClown } = useSounds();
  const { passarVez, handleSortearCarta } = actions; // Dependências de ações de jogo

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

  return {
    showRevengeSelector,
    setShowRevengeSelector,
    handleUseShield,
    handleUseSwap,
    handleUseRevenge,
    handleConfirmRevenge
  };
}
