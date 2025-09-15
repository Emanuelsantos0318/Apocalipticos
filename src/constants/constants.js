// ======================================
// CONSTANTES PRINCIPAIS (ES Modules Format)
// ======================================

// 1. Modos de Jogo
export const GAME_MODES = {
  NORMAL: "normal",
  ADULTO: "mais18",
  DIFICIL: "dificil"
};

// 2. Tipos de Cartas
export const CARD_TYPES = {
  TRUTH: "verdade",
  DARE: "desafio",
  NEVER: "euNunca",
  FRIENDS: "amigosMerda",
  DECISIONS: "decisoesMerda"
};

// 3. Categorias
export const CATEGORIES = {
  TRUTH_OR_DARE: "verdadeDesafio",
  NEVER_HAVE_I_EVER: "euNunca",
  BAD_DECISIONS: "decisoesMerda",
  SHITTY_FRIENDS: "amigosMerda"
};

// 4. Estados do Jogo
export const GAME_STATES = {
  WAITING: "esperando",
  ONGOING: "em_andamento",
  FINISHED: "finalizado",
  ABORTED: "cancelado"
};

// 5. Configurações Padrão
export const DEFAULTS = {
  MAX_PLAYERS: 8,
  TIMEOUT: 30, // segundos
  ROUND_LIMIT: 10
};

// 6. Prefixos para Salas
export const ROOM_PREFIXES = ["ZUMBI", "RADI", "FOME", "MOTO", "APOC"];



// 7. Métodos auxiliares
export const isAdultMode = (mode) => [GAME_MODES.ADULTO, GAME_MODES.EXTREMO].includes(mode);

export const getModeRules = (mode) => {
  switch(mode) {
    case GAME_MODES.ADULTO:
      return { minAge: 18, maxPlayers: 10 };
    case GAME_MODES.EXTREMO:
      return { minAge: 21, maxPlayers: 6 };
    default:
      return { minAge: 16, maxPlayers: 8 };
  }

};