export const ROLES = {
  MEDIC: {
    id: "medico",
    name: "A Médica da Zona Morta",
    icon: "🩺",
    image: "/assets/characters/medica_Itala.webp",
    description: "Cura feridas, mas tudo tem um preço.",
    ability: {
      name: "Tratamento de Risco",
      effect: "Cura +1 PV de qualquer jogador.",
      cost: "1 Dose (Médico) + 1 Dose (Paciente)",
      cooldown: "Não pode curar o mesmo alvo 2x seguidas.",
    },
    lore: "Antiga socorrista. Aprendeu que salvar vidas sempre cobra um preço.",
  },
  ASSASSIN: {
    id: "assassino",
    name: "O Assassino das Ruínas",
    icon: "🔪",
    image: "/assets/characters/assassina.webp",
    description: "Especialista em causar dano massivo.",
    ability: {
      name: "Roubo de Sangue",
      effect: "Rouba 2 PV de um alvo.",
      cost: "2 Doses",
      limit: "Uso único por partida.",
    },
    lore: "Ninguém sabe de onde veio. A violência é sua moeda.",
  },
  STRATEGIST: {
    id: "estrategista",
    name: "O Estrategista Careca",
    icon: "🧠",
    image: "/assets/characters/estrategista_Emanuel.webp",
    description: "Controla o fluxo do jogo.",
    ability: {
      name: "Plano de Contingência",
      effect: "Inverte ou altera a ordem dos turnos.",
      cost: "1 Dose",
      cooldown: "-",
    },
    lore: "Ex-líder de abrigo. Sabe que decisões erradas matam.",
  },
  ARSONIST: {
    id: "incendiaria",
    name: "A Incendiária",
    icon: "🔥",
    image: "/assets/characters/incendiaria.webp",
    description: "Gosta de ver o caos reinar.",
    ability: {
      name: "Caos Controlado",
      effect: "Força jogador a comprar carta. Recusa = Dano Dobrado.",
      cost: "2 Doses",
      cooldown: "-",
    },
    lore: "Viveu entre gangues. Ama ver tudo pegar fogo.",
  },
  SURVIVOR: {
    id: "sobrevivente",
    name: "O Sobrevivente",
    icon: "☠️",
    image: "/assets/characters/sobrevivente.webp",
    description: "Difícil de matar.",
    ability: {
      name: "Último Fôlego",
      effect: "Ao chegar a 0 PV, fica com 1 PV automaticamente.",
      cost: "2 Doses (Auto)",
      limit: "Uso único (Automático).",
    },
    lore: "Já deveria estar morto. Ninguém sabe como ainda respira.",
  },
  BARMAN: {
    id: "barman",
    name: "O Barman",
    icon: "🍺",
    image: "/assets/characters/barman_Mateus.webp",
    description: "O dono do bar.",
    ability: {
      name: "A Saideira",
      effect:
        "Força um jogador a repetir o último desafio ou beber o dobro da punição atual.",
      cost: "1 Dose (Barman) + 1 Dose (Paciente)",
      cooldown: "Não pode curar o mesmo alvo 2x seguidas.",
    },
    lore: "O dono do bar. Sabe de tudo e todos.",
  },
};

export const ROLE_LIST = Object.values(ROLES);
