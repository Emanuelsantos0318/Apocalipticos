// const { initializeApp } = require('firebase/app');
// const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
// const {  GAME_MODES,  CARD_TYPES, CATEGORIES, isAdultMode} = require('apocalipticos/src/constants/constants.js');
//   console.log(constants.GAME_MODES.NORMAL);
// Configuração (substitua com suas credenciais)
// src/firebase/seedDatabase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

// Constantes (Duplicadas para evitar problemas de importação no Node)
const GAME_MODES = {
  NORMAL: "normal",
  ADULTO: "mais18",
  DIFICIL: "dificil"
};

const CARD_TYPES = {
  TRUTH: "verdade",
  DARE: "desafio",
  NEVER: "euNunca",
  FRIENDS: "amigosMerda",
  DECISIONS: "decisoesMerda"
};

const CATEGORIES = {
  TRUTH_OR_DARE: "verdadeDesafio",
  NEVER_HAVE_I_EVER: "euNunca",
  BAD_DECISIONS: "decisoesMerda",
  SHITTY_FRIENDS: "amigosMerda"
};

// Configuração do Firebase (Hardcoded para o script de seed)
// Em produção, usar variáveis de ambiente seria melhor, mas para um script local ok.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const cards = [
  // --- VERDADES CABULOSAS (Adulto/Difícil) ---
  { texto: "Qual a maior mentira que já contou pra alguém aqui?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Já pegou alguém comprometido? Conta os detalhes.", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Já fez sexo em lugar público? Onde e com quem?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Se fosse transar com alguém dessa roda, quem seria?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Já mandou nude e se arrependeu? Manda print da conversa.", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Já fingiu orgasmo? Com quem?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Com quem aqui você nunca teria nada nem bêbado(a)?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Qual seu fetiche mais vergonhoso?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Já stalkeou alguém aqui? O que achou?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Já broxou? Conta como foi.", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },

  // --- DESAFIOS EXTREMOS (Adulto/Difícil) ---
  { texto: "Simula sexo oral em um objeto escolhido pela roda.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Rebola no colo de alguém por 1 minuto sem rir.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Finge que está no pornô mais bizarro que já viu por 30 segundos.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Pega um cubo de gelo e esfrega entre as coxas até derreter.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Faz chamada de vídeo pro ex e pergunta: “você ainda me comeria?”", tipo: CARD_TYPES.DARE, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Pede um nude em voz alta pra alguém aleatório nos seus contatos.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Pega o número de um desconhecido e convida pra um 'encontro selvagem'.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Deixa alguém da roda mandar uma mensagem doida do seu Insta.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.ADULTO, categoria: CATEGORIES.TRUTH_OR_DARE },

  // --- DESAFIOS NORMAIS (Normal) ---
  { texto: "Tente lamber o cotovelo de olhos fechados.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Faça uma foto com sua careta mais estranha e publique na sua rede social.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Dance lambada com a pessoa do seu lado.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Curta a última foto do seu ex nas redes sociais.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Dê uma volta na sala andando feito caranguejo.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Dê o telefone na mão da pessoa à sua frente e deixe ela publicar alguma coisa nas suas redes sociais.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Massageie os pés da pessoa ao lado.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Cante o refrão de uma música com a língua pra fora.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Beba água de um potinho, como um cachorro.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Escolha alguém do grupo para ficar de mãos dadas até o final do jogo.", tipo: CARD_TYPES.DARE, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
];

async function seedDatabase() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const batch = writeBatch(db);
    const cartasRef = collection(db, 'cartas');

    console.log(`🌱 Preparando para inserir ${cards.length} cartas...`);

    cards.forEach((card) => {
      const newDocRef = doc(cartasRef);
      batch.set(newDocRef, card);
    });

    await batch.commit();

    console.log('✅ Banco de dados semeado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao semear dados:', error);
    process.exit(1);
  }
}

seedDatabase();