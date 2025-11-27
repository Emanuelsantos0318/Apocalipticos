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
      avatar: roomData.avatar || "☣️",
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

  await updateDoc(salaRef, {
    estado: GAME_STATES.ONGOING,
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
