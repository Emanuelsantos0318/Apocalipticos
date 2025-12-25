import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper para ler .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

let envConfig = {};
try {
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envConfig[key.trim()] = value.trim();
      }
    });
  } else {
    console.warn("⚠️ Arquivo .env não encontrado em:", envPath);
  }
} catch (e) {
  console.warn("⚠️ Não foi possível ler o arquivo .env:", e.message);
}

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

// Configuração do Firebase
const firebaseConfig = {
    apiKey: envConfig.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
    projectId: envConfig.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
};

const cards = [
  // --- EU NUNCA (Normal) ---
  { texto: "Eu nunca andei a cavalo. ", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },
  { texto: "Eu nunca bebi álcool.", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },
  { texto: "Eu nunca menti sobre a minha idade para fletar.", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },
  { texto: "Eu nunca terminei um relacionamento por mensagem. ", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },
  { texto: "Eu nunca roubei algo em uma loja.", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },
  { texto: "Eu nunca me arrependi imediatamente depois de fazer algo.", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },
  { texto: "Eu nunca cantei a música inteira errando a letra.", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },
  {texto: "Eu nunca matei um gato", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },
  {texto: "Eu nunca sair escondido para ir na casa de alguem.", tipo: CARD_TYPES.NEVER, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.NEVER_HAVE_I_EVER },

  // --- VERDADES LEVES (Normal) ---
  { texto: "Qual foi a coisa mais vergonhosa que você já fez na escola?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Quem dessa roda você levaria para uma ilha deserta?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Qual é o seu maior medo irracional?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Se pudesse ser invisível por um dia, o que faria?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Qual foi o pior presente que já recebeu e fingiu gostar?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Você já stalkeou alguém nas redes sociais hoje?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Qual é a sua mania mais estranha?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Você fala sozinho quando está em casa?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Qual personagem de desenho animado seria seu crush?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },
  { texto: "Se pudesse trocar de vida com alguém aqui por um dia, quem seria?", tipo: CARD_TYPES.TRUTH, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.TRUTH_OR_DARE },

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

  // --- AMIGOS DE MERDA (Votação) ---
  { texto: "Quem seria o primeiro a morrer em um apocalipse zumbi?", tipo: CARD_TYPES.FRIENDS, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.SHITTY_FRIENDS },
  { texto: "Quem tem mais chance de ser preso por engano?", tipo: CARD_TYPES.FRIENDS, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.SHITTY_FRIENDS },
  { texto: "Quem gasta todo o salário com coisas inúteis?", tipo: CARD_TYPES.FRIENDS, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.SHITTY_FRIENDS },
  { texto: "Quem fingiria a própria morte para fugir de dívidas?", tipo: CARD_TYPES.FRIENDS, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.SHITTY_FRIENDS },
  { texto: "Quem se tornaria um ditador se tivesse poder?", tipo: CARD_TYPES.FRIENDS, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.SHITTY_FRIENDS },
  { texto: "Quem tem o histórico de pesquisa mais vergonhoso?", tipo: CARD_TYPES.FRIENDS, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.SHITTY_FRIENDS },
  { texto: "Quem venderia um órgão para comprar o iPhone novo?", tipo: CARD_TYPES.FRIENDS, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.SHITTY_FRIENDS },
  { texto: "Quem provavelmente já foi banido de algum lugar?", tipo: CARD_TYPES.FRIENDS, modo: GAME_MODES.NORMAL, categoria: CATEGORIES.SHITTY_FRIENDS },
];

async function seedDatabase() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const cartasRef = collection(db, 'cartas');
    const batch = writeBatch(db);
    let addedCount = 0;
    let skippedCount = 0;

    console.log(`🌱 Verificando ${cards.length} cartas...`);

    // Processar cartas em chunks ou sequencialmente para evitar sobrecarga de leituras se forem muitas.
    // Como são poucas dezenas/centenas, sequencial com Promise.all é ok, mas o batch tem limite de 500 ops.
    // Vamos fazer um loop simples para verificar existência.

    // NOTA: Para muita performance com milhares de cartas, seria melhor ler todas do banco em memória primeiro.
    // Mas para este uso (admin tool), verificar uma a uma é seguro.

    // Vamos ler todas as cartas existentes primeiro para minimizar leituras (1 leitura de coleção vs N leituras)
    const snapshot = await getDocs(cartasRef);
    const existingTexts = new Set(snapshot.docs.map(doc => doc.data().texto));

    console.log(`📚 ${existingTexts.size} cartas já existem no banco.`);

    cards.forEach((card) => {
      if (!existingTexts.has(card.texto)) {
        const newDocRef = doc(cartasRef);
        batch.set(newDocRef, card);
        addedCount++;
        // Adiciona ao set para evitar duplicatas dentro do próprio array de input se houver
        existingTexts.add(card.texto);
      } else {
        skippedCount++;
      }
    });

    if (addedCount > 0) {
      await batch.commit();
      console.log(`✅ ${addedCount} novas cartas adicionadas!`);
    } else {
      console.log(`✨ Nenhuma carta nova para adicionar.`);
    }

    if (skippedCount > 0) {
      console.log(`⏭️ ${skippedCount} cartas já existiam e foram puladas.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao semear dados:', error);
    process.exit(1);
  }
}

seedDatabase();