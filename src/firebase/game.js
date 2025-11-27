import { db } from "./config";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { CARD_TYPES } from "../constants/constants";

export async function sortearCarta(modo, categorias) {
  const cartasRef = collection(db, "cartas");
  const q = query(
    cartasRef,
    where("modo", "==", modo),
    where("categoria", "in", categorias)
  );

  const snapshot = await getDocs(q);
  const cartas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  if (cartas.length === 0) {
    throw new Error("Nenhuma carta encontrada para os critérios");
  }

  return cartas[Math.floor(Math.random() * cartas.length)];
}

export async function proximoJogador(salaId, jogadorAtualUid) {
  const jogadoresRef = collection(db, "salas", salaId, "jogadores");
  const snapshot = await getDocs(jogadoresRef);
  const jogadores = snapshot.docs.map(doc => doc.id);

  if (jogadores.length <= 1) return jogadorAtualUid;

  // Filtrar o jogador atual para não repetir imediatamente (opcional)
  const outrosJogadores = jogadores.filter(uid => uid !== jogadorAtualUid);
  
  // Se só tinha 1 outro jogador, retorna ele. Se tinha mais, sorteia.
  // Se por acaso o filtro removeu todos (ex: só 1 jogador na sala), retorna o mesmo.
  if (outrosJogadores.length === 0) return jogadorAtualUid;

  const proximo = outrosJogadores[Math.floor(Math.random() * outrosJogadores.length)];
  return proximo;
}

export async function submitVote(salaId, voterUid, targetUid) {
  const voteRef = doc(db, "salas", salaId, "votos", voterUid);
  await setDoc(voteRef, {
    target: targetUid,
    timestamp: serverTimestamp()
  });
}