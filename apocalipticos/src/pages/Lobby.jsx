import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, onSnapshot, collection } from "firebase/firestore";

export default function Lobby() {
  const { codigo } = useParams(); // Recebe código da sala da URL
  const [sala, setSala] = useState(null);
  const [jogadores, setJogadores] = useState([]);

  // Ouve os dados da sala
  useEffect(() => {
    const salaRef = doc(db, "salas", codigo);
    const unsubscribeSala = onSnapshot(salaRef, (docSnap) => {
      if (docSnap.exists()) {
        setSala(docSnap.data());
      }
    });

    // Ouve a lista de jogadores da sala
    const jogadoresRef = collection(db, "salas", codigo, "jogadores");
    const unsubscribeJogadores = onSnapshot(jogadoresRef, (snapshot) => {
      const lista = snapshot.docs.map((doc) => doc.data());
      setJogadores(lista);
    });

    return () => {
      unsubscribeSala();
      unsubscribeJogadores();
    };
  }, [codigo]);

  return (
    <div className="text-white p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Lobby da Sala</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <p className="text-lg">Código da Sala:</p>
        <p className="text-3xl font-mono font-bold text-orange-400">{codigo}</p>

        {sala && (
          <p className="mt-2">
            Modo: <strong>{sala.modo}</strong>
          </p>
        )}
      </div>

      <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Jogadores conectados:</h2>
        {jogadores.length > 0 ? (
          <ul className="space-y-1">
            {jogadores.map((jogador, i) => (
              <li key={i} className="bg-gray-900 py-1 rounded">
                {jogador.nome || `Anônimo ${i + 1}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Aguardando jogadores...</p>
        )}
      </div>

      <button
        className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
        disabled={jogadores.length < 2}
        onClick={() => alert("Jogo iniciado!")}
      >
        Iniciar Jogo
      </button>
    </div>
  );
}
