import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, onSnapshot, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { sortearCarta } from "../firebase/game";
import { GameHeader } from "../components/game/GameHeader";
import CardDisplay from "../components/game/CardDisplay";
import PlayerActions from "../components/game/PlayerActions";
import Timer from "../components/game/Timer";

export default function Jogo() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [sala, setSala] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [actionTaken, setActionTaken] = useState(false);

  // Monitorar estado do jogo
  useEffect(() => {
    const salaRef = doc(db, "salas", codigo);
    const unsubscribe = onSnapshot(salaRef, (docSnap) => {
      if (!docSnap.exists()) {
        navigate("/");
        return;
      }

      const data = docSnap.data();
      setSala(data);
      setCurrentPlayer(data.jogadorAtual);

      if (data.estado === "finalizado") {
        navigate(`/resultado/${codigo}`);
      }
    });

    return unsubscribe;
  }, [codigo, navigate]);

  // Temporizador da rodada
  useEffect(() => {
    if (!sala?.cartaAtual || actionTaken) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handlePenalidade(); // ao chegar em 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sala, actionTaken]);

  const isCurrentPlayer = currentPlayer && currentPlayer === user?.uid;
  const showActions = isCurrentPlayer && sala?.cartaAtual && !actionTaken;

  const handleSortearCarta = async () => {
    if (!isCurrentPlayer || !sala) return;

    try {
      const carta = await sortearCarta(sala.modo, sala.categorias);
      await updateDoc(doc(db, "salas", codigo), {
        cartaAtual: carta,
        jogadorAtual: user.uid,
        timeLeft: 30
      });
      setTimeLeft(30);
      setActionTaken(false);
    } catch (error) {
      console.error("Erro ao sortear carta:", error);
    }
  };

  const handleComplete = async () => {
    await updatePlayerStats("completou");
    setActionTaken(true);
  };

  const handlePenalidade = async () => {
    await updatePlayerStats("recusou");
    setActionTaken(true);
  };

  const updatePlayerStats = async (action) => {
    if (!user) return;
    try {
      const playerRef = doc(db, "salas", codigo, "jogadores", user.uid);
      await updateDoc(playerRef, {
        [`stats.${action}`]: increment(1),
        ultimaAcao: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar stats do jogador:", error);
    }
  };

  if (!sala) {
    return <div className="text-white text-center p-8">Carregando jogo...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <GameHeader 
          codigo={codigo}
          modo={sala.modo}
          currentPlayer={currentPlayer}
          isCurrentPlayer={isCurrentPlayer}
        />

        {sala.cartaAtual ? (
          <>
            <CardDisplay 
              carta={sala.cartaAtual}
              timeLeft={timeLeft}
            />

            {showActions && (
              <PlayerActions
                onComplete={handleComplete}
                onPenalidade={handlePenalidade}
                cardType={sala.cartaAtual.tipo}
              />
            )}

            <Timer 
              timeLeft={timeLeft}
              totalTime={30}
            />
          </>
        ) : (
          <div className="text-center py-12">
            {isCurrentPlayer ? (
              <button
                onClick={handleSortearCarta}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-bold"
              >
                Sortear Carta
              </button>
            ) : (
              <p>Aguardando carta...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
