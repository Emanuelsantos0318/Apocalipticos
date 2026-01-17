import { db } from "./config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { CARD_TYPES } from "../constants/constants";
import { CHAOS_EVENTS } from "../constants/chaosEvents";

/**
 * Sorteia uma carta aleatória do banco de dados baseada no modo e categorias.
 * @param {string} modo - O modo de jogo (ex: 'normal', 'mais18').
 * @param {string[]} categorias - Lista de categorias ativas.
 * @param {string} [tipo] - (Opcional) Tipo específico de carta (ex: 'verdade', 'desafio').
 * @param {string[]} [cartasUsadas] - (Opcional) Array de IDs de cartas já usadas.
 * @returns {Promise<{carta: Object, reset: boolean}>} Objeto com a carta sorteada e flag de reset.
 * @throws {Error} Se nenhuma carta for encontrada.
 */
export async function sortearCarta(
  modo,
  categorias,
  tipo = null,
  cartasUsadas = []
) {
  const cartasRef = collection(db, "cartas");
  let constraints = [
    where("modo", "==", modo),
    where("categoria", "in", categorias),
  ];

  if (tipo) {
    constraints.push(where("tipo", "==", tipo));
  }

  const q = query(cartasRef, ...constraints);

  // 1. Chance de Evento do Caos (20%)
  // Apenas se NÃO estivermos buscando um tipo específico (sorteio normal)
  if (!tipo && Math.random() < 0.2) {
    const eventos = CHAOS_EVENTS;
    const eventoSorteado = eventos[Math.floor(Math.random() * eventos.length)];

    console.log("🔥 EVENTO DO CAOS SORTEADO:", eventoSorteado.name);

    return {
      carta: {
        ...eventoSorteado,
        isChaosEvent: true,
        texto: eventoSorteado.description, // Compatibilidade com UI de carta
        tipo: "CAOS",
      },
      reset: false,
    };
  }

  const snapshot = await getDocs(q);
  const cartas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (cartas.length === 0) {
    // Fallback: se não achar do tipo específico, tenta achar qualquer uma (e ignora filtro, pois vai falhar)
    if (tipo) {
      console.warn(
        `Nenhuma carta do tipo ${tipo} encontrada. Tentando fallback...`
      );
      return sortearCarta(modo, categorias, null, cartasUsadas);
    }
    throw new Error("Nenhuma carta encontrada para os critérios");
  }

  // Filtrar cartas já usadas
  let cartasDisponiveis = cartas.filter(
    (cart) => !cartasUsadas.includes(cart.id)
  );
  let reset = false;

  // Se todas as cartas já foram usadas, reseta o histórico e usa todas novamente
  if (cartasDisponiveis.length === 0) {
    console.log("Deck finalizado! Reembaralhando...");
    cartasDisponiveis = cartas;
    reset = true;
  }

  const cartaSorteada =
    cartasDisponiveis[Math.floor(Math.random() * cartasDisponiveis.length)];
  return { carta: cartaSorteada, reset };
}

/**
 * Determina o próximo jogador da rodada.
 * Evita repetir o mesmo jogador imediatamente, se possível.
 * @param {string} salaId - ID da sala.
 * @param {string} jogadorAtualUid - UID do jogador que acabou de jogar.
 * @returns {Promise<string>} UID do próximo jogador.
 */
export async function proximoJogador(salaId, jogadorAtualUid) {
  const jogadoresRef = collection(db, "salas", salaId, "jogadores");
  const snapshot = await getDocs(jogadoresRef);
  const jogadores = snapshot.docs.map((doc) => doc.id);

  if (jogadores.length <= 1) return jogadorAtualUid;

  // Filtrar o jogador atual para não repetir imediatamente (opcional)
  const outrosJogadores = jogadores.filter((uid) => uid !== jogadorAtualUid);

  // Se só tinha 1 outro jogador, retorna ele. Se tinha mais, sorteia.
  // Se por acaso o filtro removeu todos (ex: só 1 jogador na sala), retorna o mesmo.
  if (outrosJogadores.length === 0) return jogadorAtualUid;

  const proximo =
    outrosJogadores[Math.floor(Math.random() * outrosJogadores.length)];
  return proximo;
}

/**
 * Registra o voto de um jogador na rodada de "Amigos de Merda".
 * @param {string} salaId - ID da sala.
 * @param {string} voterUid - UID de quem está votando.
 * @param {string} targetUid - UID de quem recebeu o voto.
 */
export async function submitVote(salaId, voterUid, targetUid) {
  const voteRef = doc(db, "salas", salaId, "votos", voterUid);
  await setDoc(voteRef, {
    target: targetUid,
    timestamp: serverTimestamp(),
  });
}

/**
 * Atualiza a classe/papel de um jogador e inicializa seus status de RPG.
 * @param {string} salaId - ID da sala.
 * @param {string} uid - UID do jogador.
 * @param {string} roleId - ID da classe selecionada (medico, assassino, etc).
 */
export async function updatePlayerRole(salaId, uid, roleId) {
  const playerRef = doc(db, "salas", salaId, "jogadores", uid);
  await setDoc(
    playerRef,
    {
      role: roleId,
      hp: 30, // Vida Inicial
      maxHp: 30,
      isCritical: false,
      status: [], // buffs/debuffs
      roleUsed: false, // para habilidades de uso único
    },
    { merge: true }
  );
}
