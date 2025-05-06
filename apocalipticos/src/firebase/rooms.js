// firebase/rooms.js

import { db } from "./config";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export async function criarSala(uid, roomData) {
  const salaRef = doc(db, "salas", roomData.roomCode);

  const sala = {
    roomCode: roomData.roomCode,
    limiteJogadores: roomData.limiteJogadores,
    modo: roomData.modo, // <-- string ("normal", "18", etc)
    categorias: roomData.categorias, // <-- array de strings
    nomeAdmin: roomData.nomeAdmin,
    dataNascimento: roomData.dataNascimento,
    hostUid: uid,
    estado: "lobby",
    criadoEm: new Date().toISOString(),
    jogadores: {
      [uid]: {
        apelido: roomData.nomeAdmin,
        avatar: "☣️", // você pode personalizar
        cumpriu: 0,
        recusou: 0,
      },
    },
  };

  await setDoc(salaRef, sala);
  return roomData.roomCode;
}
export async function iniciarJogo(roomCode) {
  const salaRef = doc(db, "salas", roomCode);
  await updateDoc(salaRef, {
    estado: "emAndamento",
  });
}