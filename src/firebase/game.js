import { db } from "./config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { CARD_TYPES } from "../constants/constants";

export async function sortearCarta(modo, categorias) {
  const cartasRef = collection(db, "cartas");
  const q = query(
    cartasRef,
    where("modo", "==", modo),
    where("categoria", "in", categorias)
  );

  const snapshot = await getDocs(q);
  const cartas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  if (cartas.length === 0) {
    throw new Error("Nenhuma carta encontrada para os critérios");
  }

  return cartas[Math.floor(Math.random() * cartas.length)];
}