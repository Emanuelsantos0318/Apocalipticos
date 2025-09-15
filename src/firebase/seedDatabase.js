// src/firebase/seedDatabase.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const {  GAME_MODES,  CARD_TYPES, CATEGORIES, isAdultMode} = require('apocalipticos/src/constants/constants.js');
  console.log(constants.GAME_MODES.NORMAL);
// Configuração (substitua com suas credenciais)
const firebaseConfig = {
    apiKey: "AIzaSyAVS_gb4f31FKb0jY11U-w7PmIVBxmaNxc",
    projectId: "apocalipticos-ab93c",
};

async function seedDatabase() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 1. Adicionar cartas
    const cartasRef = collection(db, 'cartas');
    await setDoc(doc(cartasRef), {
      tipo: CARD_TYPES.TRUTH,
      texto: "Você já traiu a confiança de alguém importante para você?",
      modo: GAME_MODES.NORMAL
    });

    console.log('✅ Banco de dados semeado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao semear dados:', error);
  }
}

seedDatabase();