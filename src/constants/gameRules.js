import { 
  GAME_MODES, 
  CATEGORIES 
} from '@/constants/constants';

export const GAME_RULES = {
  // Regras para modo Normal
  [GAME_MODES.NORMAL]: {
    maxPlayers: 8,
    minAge: 14,
    allowedCategories: [
      CATEGORIES.TRUTH_OR_DARE,
      CATEGORIES.NEVER_HAVE_I_EVER
    ],
    punishment: {
      type: 'drink',
      amount: 1
    },
    timeout: 30 // segundos
  },

  // Regras para modo Adulto
  [GAME_MODES.ADULTO]: {
    maxPlayers: 10,
    minAge: 18,
    allowedCategories: Object.values(CATEGORIES),
    punishment: {
      type: 'drink',
      amount: 2
    },
    timeout: 45
  },

  // Regras para modo Difícil
  [GAME_MODES.DIFICIL]: {
    maxPlayers: 6,
    minAge: 16,
    allowedCategories: [
      CATEGORIES.TRUTH_OR_DARE,
      CATEGORIES.BAD_DECISIONS
    ],
    punishment: {
      type: 'extreme',
      actions: ['drink', 'extra_challenge']
    },
    timeout: 60
  }
};

// Funções auxiliares
export const getModeRules = (mode) => GAME_RULES[mode] || GAME_RULES[GAME_MODES.NORMAL];

export const isCategoryAllowed = (mode, category) => {
  const rules = getModeRules(mode);
  return rules.allowedCategories.includes(category);
};