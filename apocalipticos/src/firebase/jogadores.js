import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./config";

// Atualiza a pontuação somando 'delta'

export const atualizarPontuacao = async (salaId, jogadorUid, delta) => {
  const jogadorRef = doc(db, "salas", salaId, "jogadores", jogadorUid);

  try {
    await updateDoc(jogadorRef, {
      pontuacao: increment(delta),
    });
  }catch (error){
    console.error("Erro ao atualizar pontuação", error);
    
  }
}