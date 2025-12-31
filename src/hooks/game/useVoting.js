import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { registrarVoto } from "../../firebase/rooms";
import { useSounds } from "../../hooks/useSounds";
import { CARD_TYPES } from "../../constants/constants";

export function useVoting(codigo, sala, jogadores, meuUid) {
  const [votos, setVotos] = useState({});
  const [resultadoVotacao, setResultadoVotacao] = useState(null);
  const { playClown } = useSounds();

  const isVotingRound = sala?.cartaAtual?.tipo === CARD_TYPES.FRIENDS;
  const currentPlayer = sala?.jogadorAtual;
  const isCurrentPlayer = currentPlayer === meuUid;

  // Resetar estados quando a carta muda
  useEffect(() => {
     if (!sala?.cartaAtual) {
         setResultadoVotacao(null);
         setVotos({});
     }
  }, [sala?.cartaAtual?.id]); // Use ID id to detect change

  // Listener de Votos
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
  }, [codigo, isVotingRound, jogadores.length]); // Dependências cruciais

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
      // Garantia que apenas UM cliente execute a escrita
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

  const handleVote = async (targetUid) => {
    try {
      await registrarVoto(codigo, meuUid, targetUid);
      toast.success("Voto registrado!");
    } catch (error) {
      console.error("Erro ao votar:", error);
      toast.error("Erro ao registrar voto.");
    }
  };

  return { votos, resultadoVotacao, handleVote, setResultadoVotacao, calcularResultadoVotacao };
}
