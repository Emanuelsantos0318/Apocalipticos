export const CHAOS_EVENTS = [
  {
    id: "ORGULHO",
    name: "Orgulho - O Ditador Supremo",
    description:
      "Você é o Ditador! Crie uma regra absoluta. Quem desobedecer, você multa.",
    type: "GLOBAL_EFFECT",
    duration: 3, // duracao em rodadas
    icon: "👑",
    color: "bg-yellow-600",
    slug: "pride_dictator",
  },
  {
    id: "GANANCIA",
    name: "Ganância - Modo Blitz",
    description:
      "O tempo vale ouro! O timer agora é de 10s e as penalidades são TRIPLAS.",
    type: "GLOBAL_EFFECT",
    duration: 2,
    icon: "💣",
    color: "bg-red-600",
    slug: "greed_blitz",
  },
  {
    id: "INVEJA",
    name: "Inveja - Troca de Corpos",
    description:
      "Os nomes e avatares foram trocados! Cuidado em quem você vota.",
    type: "GLOBAL_EFFECT",
    duration: 1,
    icon: "🎭",
    color: "bg-green-600",
    slug: "envy_swap",
  },
  {
    id: "GULA",
    name: "Gula - Banquete Tóxico",
    description:
      "Todos devem escolher agora: Beber 1 dose segura ou Arriscar 3 doses?",
    type: "IMMEDIATE_ACTION",
    duration: 0,
    icon: "🍔",
    color: "bg-orange-600",
    slug: "gluttony_banquet",
  },
  {
    id: "IRA",
    name: "Ira - Surto de Violência",
    description:
      "Escolha dois jogadores para duelarem. Quem perder, bebe em dobro.",
    type: "IMMEDIATE_ACTION",
    duration: 0,
    icon: "😡",
    color: "bg-red-800",
    slug: "wrath_duel",
  },
  {
    id: "PREGUICA",
    name: "Preguiça - Abrigo Adormecido",
    description:
      "Tudo acontece em câmera lenta. Timer de 45s, pode pular a vez (custo: 1 dose).",
    type: "GLOBAL_EFFECT",
    duration: 1,
    icon: "😴",
    color: "bg-blue-400",
    slug: "sloth_slow",
  },
  {
    id: "LUXURIA",
    name: "Luxúria - Pacto Proibido",
    description:
      "Escolha um parceiro. O que acontecer com um, acontece com o outro.",
    type: "PERSISTENT_EFFECT",
    duration: 99, // Ate o fim do jogo
    icon: "💔",
    color: "bg-pink-600",
    slug: "lust_bond",
  },
];
