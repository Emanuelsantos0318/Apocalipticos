// Importe as constantes primeiro
import {
  GAME_MODES,
  CATEGORIES,
  GAME_STATES,
  DEFAULTS,
} from "../constants/constants"; // Ajuste o caminho conforme sua estrutura

import { db } from "./config";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  orderBy,
  query,
  limit,
  where,
  // arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { GAME_RULES } from "../constants/gameRules";
// Versão otimizada da função criarSala usando constantes
export async function criarSala(uid, roomData) {
  // Validação robusta usando constantes
  if (!Object.values(GAME_MODES).includes(roomData.modo)) {
    throw new Error(
      `Modo inválido. Valores permitidos: ${Object.values(GAME_MODES).join(
        ", "
      )}`
    );
  }

  if (!Array.isArray(roomData.categorias) || roomData.categorias.length === 0) {
    // Se nenhuma categoria for especificada, ativa todas por padrão
    roomData.categorias = Object.values(CATEGORIES);
  }

  if (
    !roomData.categorias.every((cat) => Object.values(CATEGORIES).includes(cat))
  ) {
    throw new Error(
      `Categoria inválida. Valores permitidos: ${Object.values(CATEGORIES).join(
        ", "
      )}`
    );
  }

  const salaRef = doc(db, "salas", roomData.roomCode);

  const sala = {
    roomCode: roomData.roomCode,
    limiteJogadores: roomData.limiteJogadores || DEFAULTS.MAX_PLAYERS,
    modo: roomData.modo,
    categorias: roomData.categorias,
    config: {
      tempoResposta: DEFAULTS.TIMEOUT,
      penalidade: "beber",
      rodadas: null,
    },
    host: {
      uid,
      nome: roomData.nomeAdmin,
      avatar: roomData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
      idade: calcularIdade(roomData.dataNascimento),
    },
    estado: GAME_STATES.WAITING, // Usando constante
    discordLink: roomData.discordLink,
    historico: [],
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  };

  await setDoc(salaRef, sala);

  // Cria registro do jogador host
  await setDoc(doc(db, "salas", roomData.roomCode, "jogadores", uid), {
    uid,
    nome: roomData.nomeAdmin,
    avatar: sala.host.avatar,
    idade: sala.host.idade,
    pronto: false,
    stats: {
      cumpriu: 0,
      recusou: 0,
      bebidas: 0,
    },
    isHost: true, // Adicionado identificador de host
    timestamp: serverTimestamp(),
  });

  return roomData.roomCode;
}

// Versão melhorada de iniciarJogo
export async function iniciarJogo(roomCode) {
  const salaRef = doc(db, "salas", roomCode);

  // Buscar jogadores para sortear o primeiro
  const jogadoresRef = collection(db, "salas", roomCode, "jogadores");
  const snapshot = await getDocs(jogadoresRef);
  const jogadores = snapshot.docs.map(doc => doc.id);

  let primeiroJogador = null;
  if (jogadores.length > 0) {
    primeiroJogador = jogadores[Math.floor(Math.random() * jogadores.length)];
  }

  await updateDoc(salaRef, {
    estado: GAME_STATES.ONGOING,
    jogadorAtual: primeiroJogador,
    atualizadoEm: serverTimestamp(),
    "config.comecouEm": serverTimestamp(),
  });
}

// Nova função para geração de códigos usando constantes
export function gerarCodigoSala() {
  const prefixos = ROOM_PREFIXES;
  const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
  const sufixo = Math.floor(1000 + Math.random() * 9000);
  return `${prefixo}-${sufixo}`;
}

// Helper para verificar modos adultos
export function isModoAdulto(modo) {
  return [GAME_MODES.ADULTO, GAME_MODES.EXTREMO].includes(modo);
}

// Função auxiliar mantida
function calcularIdade(dataNascimento) {
  const diff = Date.now() - new Date(dataNascimento).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

export function validateRoomConfig(mode, config) {
  const rules = GAME_RULES[mode];
  return {
    isValid: config.limiteJogadores <= rules.maxPlayers,
    message: `Máximo de ${rules.maxPlayers} jogadores no modo ${mode}`,
  };
}


/**
 * Remove um jogador da sala e gerencia a migração de host se necessário.
 * @param {string} roomCode - Código da sala.
 * @param {string} uid - UID do jogador que está saindo.
 */
export async function sairDaSala(roomCode, uid) {
  const salaRef = doc(db, "salas", roomCode);
  const playerRef = doc(db, "salas", roomCode, "jogadores", uid);

  try {
    // 1. Verificar se o jogador é o Host antes de deletar
    const playerSnap = await getDocs(query(collection(db, "salas", roomCode, "jogadores"), where("uid", "==", uid))); // Ineficiente, melhor ler o doc direto se possível, mas aqui usamos a coleção para garantir
    // Melhor: ler o documento do jogador direto
    // const pDoc = await getDoc(playerRef); // Precisaria importar getDoc. Vamos assumir que temos os dados ou ler a coleção.
    
    // Vamos ler a coleção de jogadores para ter todos e decidir o novo host
    const jogadoresRef = collection(db, "salas", roomCode, "jogadores");
    const q = query(jogadoresRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    
    const jogadores = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const saindo = jogadores.find(j => j.uid === uid);

    if (!saindo) return; // Jogador já não existe

    // 2. Deletar o jogador
    await deleteDoc(playerRef);

    // 3. Se era o Host, passar a coroa
    if (saindo.isHost) {
      const novosJogadores = jogadores.filter(j => j.uid !== uid);
      
      if (novosJogadores.length > 0) {
        const novoHost = novosJogadores[0]; // O mais antigo (timestamp menor)
        
        // Atualiza o novo host na subcoleção
        await updateDoc(doc(db, "salas", roomCode, "jogadores", novoHost.uid), {
          isHost: true
        });

        // Atualiza o host no documento da sala
        await updateDoc(salaRef, {
          "host.uid": novoHost.uid,
          "host.nome": novoHost.nome,
          "host.avatar": novoHost.avatar
        });
      } else {
        // Se não sobrou ninguém, deleta a sala (ou marca como abandonada)
        await updateDoc(salaRef, { estado: GAME_STATES.ABORTED });
      }
    }

    // 4. Se o jogo estiver rolando e for a vez dele, passar a vez
    // Isso deve ser tratado idealmente no componente Jogo ou via Cloud Function,
    // mas podemos tentar forçar aqui se tivermos acesso à lógica de passar vez.
    // Por segurança, o front-end (Jogo.jsx) deve detectar que o jogadorAtual sumiu e pular.

  } catch (error) {
    console.error("Erro ao sair da sala:", error);
    throw error;
  }
}

/**
 * Registra uma ação de um jogador na rodada atual (ex: Eu Nunca).
 */
export async function registrarAcaoRodada(roomCode, uid, action, nome, avatar) {
  const acaoRef = doc(db, "salas", roomCode, "acoes", uid);
  await setDoc(acaoRef, {
    uid,
    action,
    nome,
    avatar,
    timestamp: serverTimestamp()
  });
}

/**
 * Limpa as ações da rodada anterior.
 */
export async function limparAcoesRodada(roomCode) {
  const acoesRef = collection(db, "salas", roomCode, "acoes");
  const snapshot = await getDocs(acoesRef);
  
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}
