import { db } from "./config";
import { collection, doc, setDoc } from "firebase/firestore";
import { generateRoomCode } from "../utils/generateRoomCode";

export async function criarSala(hostUid, modo) {
  const codigo = generateRoomCode();
  const salaRef = doc(collection(db, "salas"), codigo);

  const sala = {
    codigo,
    hostUid,
    modo,
    criadoEm: new Date().toISOString(),
    estado: "lobby",
    jogadores: {
      [hostUid]: {
        apelido: "Jogador 1",
        avatar: "☣️",
        cumpriu: 0,
        recusou: 0,
      },
    },
  };

  await setDoc(salaRef, sala);

  return codigo;
}
