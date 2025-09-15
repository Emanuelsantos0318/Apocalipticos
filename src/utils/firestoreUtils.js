import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // ou onde estiver sua instância do Firestore

export async function sortearCartaPorModo(modo, tipoEspecifico = null) {
  try {
    const cartasRef = collection(db, "cartas");

    // Base: buscar apenas cartas compatíveis com o modo
    let q = query(cartasRef, where("modo", "array-contains", modo));

    // Se tiver tipo específico (usado para 'verdadeDesafio')
    if (tipoEspecifico) {
      q = query(
        cartasRef,
        where("modo", "array-contains", modo),
        where("tipo", "==", tipoEspecifico)
      );
    }

    const snapshot = await getDocs(q);
    const cartas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (cartas.length === 0) return null;

    // Sorteia uma carta aleatória
    const indice = Math.floor(Math.random() * cartas.length);
    return cartas[indice];

  } catch (erro) {
    console.error("Erro ao buscar carta:", erro);
    return null;
  }
}
