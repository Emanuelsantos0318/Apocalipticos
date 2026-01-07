import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper para ler .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

let envConfig = {};
try {
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8");
    envFile.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
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
  DIFICIL: "dificil",
};

const CARD_TYPES = {
  TRUTH: "verdade",
  DARE: "desafio",
  NEVER: "euNunca",
  FRIENDS: "amigosMerda",
  DECISIONS: "decisoesMerda",
  DO_OR_DRINK: "fazOuBebe",
  THIS_OR_THAT: "issoOuAquilo",
};

const CATEGORIES = {
  TRUTH_OR_DARE: "verdadeDesafio",
  NEVER_HAVE_I_EVER: "euNunca",
  BAD_DECISIONS: "decisoesMerda",
  SHITTY_FRIENDS: "amigosMerda",
  DO_OR_DRINK_GAME: "fazOuBebe",
  THIS_OR_THAT_GAME: "issoOuAquilo",
};

// Configuração do Firebase
const firebaseConfig = {
  apiKey: envConfig.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  projectId:
    envConfig.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
};

// Função para mapear Modo do CSV para constante
const mapMode = (csvMode) => {
  if (!csvMode) return GAME_MODES.NORMAL;
  const mode = csvMode.toLowerCase().trim();
  if (mode === "normal") return GAME_MODES.NORMAL;
  if (mode === "dificil" || mode === "difícil") return GAME_MODES.DIFICIL;
  if (mode === "18" || mode.includes("18")) return GAME_MODES.ADULTO;
  return GAME_MODES.NORMAL; // Default
};

// Função para mapear Tipo/Jogo do CSV para constantes
const mapTypeAndCategory = (csvGame) => {
  if (!csvGame) return null;
  const game = csvGame.toLowerCase().trim();

  // Mapeamentos
  if (game.includes("amigos de merda")) {
    return { tipo: CARD_TYPES.FRIENDS, categoria: CATEGORIES.SHITTY_FRIENDS };
  }
  if (
    game.includes("decisoes de merda") ||
    game.includes("decisões de merda")
  ) {
    return { tipo: CARD_TYPES.DECISIONS, categoria: CATEGORIES.BAD_DECISIONS };
  }
  if (game.includes("verdade")) {
    return { tipo: CARD_TYPES.TRUTH, categoria: CATEGORIES.TRUTH_OR_DARE };
  }
  if (game.includes("desafio")) {
    return { tipo: CARD_TYPES.DARE, categoria: CATEGORIES.TRUTH_OR_DARE };
  }
  if (game.includes("eu nunca")) {
    return { tipo: CARD_TYPES.NEVER, categoria: CATEGORIES.NEVER_HAVE_I_EVER };
  }
  if (game.includes("faz ou bebe") || game.includes("faz ou bebi")) {
    return {
      tipo: CARD_TYPES.DO_OR_DRINK,
      categoria: CATEGORIES.DO_OR_DRINK_GAME,
    };
  }
  if (game.includes("isso ou aquilo")) {
    return {
      tipo: CARD_TYPES.THIS_OR_THAT,
      categoria: CATEGORIES.THIS_OR_THAT_GAME,
    };
  }

  return null;
};

// Ler e processar o CSV
const getCardsFromCSV = () => {
  // Arquivo padronizado em src/data/cards.csv
  const csvPath = path.resolve(__dirname, "../data/cards.csv");

  let fileContent;
  if (fs.existsSync(csvPath)) {
    console.log(`📂 Lendo CSV de: ${csvPath}`);
    fileContent = fs.readFileSync(csvPath, "utf8");
  } else {
    console.warn("⚠️ Arquivo src/data/cards.csv não encontrado.");
    return [];
  }

  const lines = fileContent.split("\n");
  const cards = [];

  // Pular cabeçalho (assumindo linha 1)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith(";;")) continue; // Linhas vazias ou inválidas

    const parts = line.split(";");
    if (parts.length < 2) continue;

    const jogo = parts[0];
    const pergunta = parts[1];
    const modo = parts[2];

    // Se a pergunta for vazia, pula
    if (!pergunta || pergunta.trim() === "") continue;

    const mapped = mapTypeAndCategory(jogo);
    if (mapped) {
      cards.push({
        texto: pergunta.trim(),
        tipo: mapped.tipo,
        modo: mapMode(modo),
        categoria: mapped.categoria,
      });
    }
  }
  return cards;
};

// Cartas Hardcoded (Legacy - mantendo caso queira garantir algumas específicas, ou podemos remover se o CSV já tiver tudo)
// Vou manter algumas de exemplo, mas a fonte principal será o CSV agora.
// Na verdade, vou concatenar.
const hardcodedCards = [
  // Pode manter vazio ou deixar as existentes se não estiverem no CSV.
  // Pelo output do usuário, o CSV parece bem completo. Vou deixar vazio para evitar duplicatas manuais chatas,
  // ou melhor, vou deixar a função getCardsFromCSV ser a fonte principal e concatenar com uma lista vazia por enquanto.
];

const cards = [...hardcodedCards, ...getCardsFromCSV()];

async function seedDatabase() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const cartasRef = collection(db, "cartas");
    const batch = writeBatch(db);
    let addedCount = 0;
    let skippedCount = 0;

    console.log(`🌱 Verificando ${cards.length} cartas...`);

    // Processar cartas em chunks ou sequencialmente para evitar sobrecarga de leituras se forem muitas.
    // Como são poucas dezenas/centenas, sequencial com Promise.all é ok, mas o batch tem limite de 500 ops.
    // Vamos fazer um loop simples para verificar existência.

    // NOTA: Para muita performance com milhares de cartas, seria melhor ler todas do banco em memória primeiro.
    // Mas para este uso (admin tool), verificar uma a uma é seguro.

    // Vamos ler todas as cartas existentes para deletá-las (Limpeza Total)
    const snapshot = await getDocs(cartasRef);

    if (!snapshot.empty) {
      console.log(`🧹 Deletando ${snapshot.size} cartas antigas...`);
      const deleteBatch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        deleteBatch.delete(doc.ref);
      });
      await deleteBatch.commit();
      console.log(`✨ Banco limpo com sucesso!`);
    }

    console.log(`🌱 Adicionando ${cards.length} cartas novas...`);

    // Como limpamos o banco, adicionamos tudo sem verificar existência
    // Batch limite é 500 operações. Se cards > 500, precisa de múltiplos batches.
    // Atualmente ~320 cartas, então um batch serve.

    cards.forEach((card) => {
      const newDocRef = doc(cartasRef);
      batch.set(newDocRef, card);
      addedCount++;
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
    console.error("❌ Erro ao semear dados:", error);
    process.exit(1);
  }
}

seedDatabase();
