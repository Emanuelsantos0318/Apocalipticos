import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { sortearCarta } from "../firebase/game";
import { GameHeader } from "../components/game/GameHeader";
import CardDisplay from "../components/game/CardDisplay";
import PlayerActions from "../components/game/PlayerActions";
import Timer from "../components/game/Timer";
import RankingJogadores from "../components/ranking/RankingJogadores";
import { atualizarPontuacao } from "../firebase/jogadores";
import PageLayout from "../components/PageLayout";

export default function Jogo() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [sala, setSala] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [actionTaken, setActionTaken] = useState(false);
  const [jogadores, setJogadores] = useState([]);
  const [meuUid, setMeuUid] = useState(null);
  const somarPonto = () => {
    atualizarPontuacao(codigo, meuUid, 10); // +10 pontos
  };
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

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("playerData"));
    setMeuUid(localData?.uid);

    const unsubscribe = onSnapshot(
      collection(db, "salas", codigo, "jogadores"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }));

        // Ordenar por pontuação decrescente
        lista.sort((a, b) => (b.pontuacao || 0) - (a.pontuacao || 0));

        setJogadores(lista);
      }
    );

    return () => unsubscribe();
  }, [codigo]);

  const handleSortearCarta = async () => {
    if (!isCurrentPlayer || !sala) return;

    try {
      const carta = await sortearCarta(sala.modo, sala.categorias);
      await updateDoc(doc(db, "salas", codigo), {
        cartaAtual: carta,
        jogadorAtual: user.uid,
        timeLeft: 30,
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
        ultimaAcao: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar stats do jogador:", error);
    }
  };

  if (!sala) {
    return <div className="text-white text-center p-8">Carregando jogo...</div>;
  }

  return (
     <PageLayout>
    <div className="min-h-screen bg-gray-900 text-white p-4 ">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          codigo={codigo}
          modo={sala.modo}
          currentPlayer={currentPlayer}
          isCurrentPlayer={isCurrentPlayer}
        />

        {sala.cartaAtual ? (
          <>
            <CardDisplay carta={sala.cartaAtual} timeLeft={timeLeft} />

            {showActions && (
              <PlayerActions
                onComplete={handleComplete}
                onPenalidade={handlePenalidade}
                cardType={sala.cartaAtual.tipo}
              />
            )}

            <Timer timeLeft={timeLeft} totalTime={30} />
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
      {/* DIREITA - RANKING FIXO NO TOPO */}
    <div className="hidden md:block w-[300px] absolute top-4 p-1 right-4 bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg">
      <h1 className="titulo text-xl font-bold mb-2 text-center ">Ranking de Jogadores</h1>
      <RankingJogadores jogadores={jogadores} meuUid={meuUid} />
      
      {/* Botão de teste */}
      <button
        onClick={somarPonto}
        className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
      >
        +10 Pontos
      </button>
    </div>
    </div>
    </PageLayout>
  );
}
