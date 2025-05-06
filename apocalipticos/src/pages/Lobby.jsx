import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { iniciarJogo } from "../firebase/rooms";


export default function Lobby({ uid }) {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [sala, setSala] = useState(null);
  const [jogadores, setJogadores] = useState([]);

  const [isHost, setIsHost] = useState(false);

  // Ouve dados da sala
  useEffect(() => {
    const salaRef = doc(db, "salas", codigo);

    let unsubscribeSala;
  
    try {
      unsubscribeSala = onSnapshot(salaRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSala(data);
  
          if (data.hostUid === uid) {
            setIsHost(true);
          }
  
          if (data.estado === "emAndamento") {
            navigate(`/jogo/${codigo}`);
          }
        } else {
          console.warn("Sala não encontrada.");
          alert("Sala não encontrada. Verifique o código e tente novamente.");
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Erro ao acessar a sala:", error);
      alert("Ocorreu um erro ao acessar a sala.");
      navigate("/");
    }

    // Ouve lista de jogadores
    const jogadoresRef = collection(db, "salas", codigo, "jogadores");
    const unsubscribeJogadores = onSnapshot(jogadoresRef, (snapshot) => {
      const lista = snapshot.docs.map((doc) => doc.data());
      setJogadores(lista);
    });

    return () => {
      if (unsubscribeSala) unsubscribeSala();
      unsubscribeJogadores();
    };
  }, [codigo, uid, navigate]);

  const isAdmin = sala?.hostUid === uid;

const handleIniciarJogo = async () => {
    try {
      await iniciarJogo(codigo);
    } catch (err) {
      console.error("Erro ao iniciar o jogo:", err);
    }
  };


  return (
    <div className="text-white p- max-w-2xl mx-auto mt-30 text-center">
      <h1 className=" font-bold mb-6">Lobby da Sala</h1>

      {!sala ? (
        <p className="text-gray-400">Carregando informações da sala...</p>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <p className="text-lg">Código da Sala:</p>
          <p className="text-3xl font-mono font-bold text-orange-400">{codigo}</p>
          <p className="mt-2">
            Modo: <strong>{sala.modo}</strong>
          </p>
        </div>
      )}

      <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Jogadores conectados:</h2>
        {jogadores.length > 0 ? (
          <ul className="space-y-2">
            {jogadores.map((jogador, i) => (
              <li
                key={i}
                className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded text-left"
              >
                <span className="text-2xl">{jogador.avatar || "👤"}</span>
                <span>{jogador.nome || `Anônimo ${i + 1}`}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Aguardando jogadores...</p>
        )}
      </div>

     {isAdmin && (
        <button
          className="bg-orange-600 hover:bg-orange-800 text-white font-bold py-2 px-6 rounded disabled:"
          disabled={jogadores.length < 2}
          onClick={() => alert("Jogo iniciado!")}
        >
          Iniciar Jogo
        </button>
      )}
    </div>
  );
}
