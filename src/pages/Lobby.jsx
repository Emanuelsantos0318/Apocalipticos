import React from "react"; // Adicione esta linha
import { FaDiscord } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import {
  doc,
  onSnapshot,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { GAME_MODES, GAME_STATES } from "../constants/constants";
import { iniciarJogo } from "../firebase/rooms";
import PlayerList from "../components/lobby/PlayerList";
import RoomHeader from "../components/lobby/RoomHeader";
import ActionButton from "../components/buttons/ActionButton";
import ImagemLogo from "../components/imagemLogo";
import ConfirmModal from "../components/modals/ConfirmModal";
import { useSounds } from "../hooks/useSounds"; // ajuste o caminho conforme necessário
import PageLayout from "../components/PageLayout";

export default function Lobby() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { currentUser: user } = useContext(AuthContext);
  const [sala, setSala] = useState(null);
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarConfirmacaoSaida, setMostrarConfirmacaoSaida] = useState(false);
  const { playMarcarPronto, playDesmarcarPronto, playRemover } = useSounds();

  // Monitorar estado da sala
  useEffect(() => {
    const salaRef = doc(db, "salas", codigo);
    const unsubscribeSala = onSnapshot(salaRef, (docSnap) => {
      if (!docSnap.exists()) {
        navigate("/", { state: { error: "Sala não encontrada" } });
        return;
      }

      const data = docSnap.data();
      setSala(data); // ✅ Só atualiza o estado, sem redirecionar aqui
    });

    // Monitorar jogadores
    const jogadoresRef = collection(db, "salas", codigo, "jogadores");
    const unsubscribeJogadores = onSnapshot(jogadoresRef, (snapshot) => {
      setJogadores(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Atualizar lastActive periodicamente
    const interval = setInterval(async () => {
      if (!user) return;
      const jogadorRef = doc(db, "salas", codigo, "jogadores", user.uid);
      try {
        await updateDoc(jogadorRef, {
          lastActive: Date.now(),
        });
      } catch (err) {
        console.error("Erro ao atualizar lastActive:", err);
      }
    }, 5000);

    return () => {
      unsubscribeSala();
      unsubscribeJogadores();
      clearInterval(interval);
    };
  }, [codigo, navigate]);
  //Caso dê algum erro é o "user"!

  // 🔁 Redirecionar quando o jogo começar
  useEffect(() => {
    if (sala?.estado === GAME_STATES.ONGOING) {
      console.log("Jogo começou, redirecionando...");
      navigate(`/jogo/${codigo}`);
    }
  }, [sala?.estado, navigate]);

  const handleIniciarJogo = async () => {
    if (jogadores.length < 2) {
      alert("Mínimo de 2 jogadores para começar!");
      return;
    }

    try {
      await iniciarJogo(codigo);
    } catch (err) {
      console.error("Erro ao iniciar jogo:", err);
      alert("Falha ao iniciar o jogo.");
    }
  };

  const handleTogglePronto = async () => {
    if (!user) return;

    const jogador = jogadores.find((j) => j.id === user.uid);
    if (!jogador) return;

    const novoStatus = !jogador.pronto;

    try {
      const jogadorRef = doc(db, "salas", codigo, "jogadores", user.uid);
      await updateDoc(jogadorRef, {
        pronto: novoStatus,
      });

      if (novoStatus) {
        playMarcarPronto();
      } else {
        playDesmarcarPronto();
      }
    } catch (err) {
      console.error("Erro ao atualizar status de pronto:", err);
    }
  };

  const handleSairDaSala = async () => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "salas", codigo, "jogadores", user.uid));
      navigate("/"); // volta pra home
    } catch (error) {
      console.error("Erro ao sair da sala:", error);
    }
  };

  const handleRemoverJogador = async (uid) => {
    if (!user || !isHost) return;

    try {
      await deleteDoc(doc(db, "salas", codigo, "jogadores", uid));
      playRemover();
    } catch (error) {
      console.error("Erro ao remover jogador:", error);
    }
  };

  if (loading || !sala) {
    return <div className="text-white text-center p-8">Carregando sala...</div>;
  }

  const isHost = user && sala.host?.uid === user.uid;
  const jogadorAtual = jogadores.find((j) => j.id === user?.uid);

  // Ignora host na checagem de prontos
  const jogadoresSemHost = jogadores.filter((j) => j.uid !== sala.host?.uid);
  const todosProntos =
    jogadoresSemHost.length > 0 &&
    jogadoresSemHost.every((j) => j.pronto === true);

  return (
    <PageLayout>
      <div className="min-h-screen text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            
            <a
              href={sala.discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:bg-[#b2b4c7] px-4 py-2 rounded-lg transition-colors"
            >
              <FaDiscord size={20} />
              Abrir Discord
            </a>
          </div>
          <ImagemLogo className="rounded-lg shadow-lg" />

          <RoomHeader codigo={codigo} modo={sala.modo} isHost={isHost} />

          <PlayerList
            jogadores={jogadores}
            currentUser={user}
            onTogglePronto={handleTogglePronto}
            isHost={isHost}
            onRemoverJogador={handleRemoverJogador}
          />

          <div className="mt-8 space-y-4">
            {isHost ? (
              <ActionButton
                onClick={handleIniciarJogo}
                disabled={!todosProntos}
                theme={todosProntos ? "primary" : "disabled"}
              >
                {todosProntos ? "Iniciar Jogo" : "Aguardando jogadores..."}
              </ActionButton>
            ) : (
              <ActionButton
                onClick={handleTogglePronto}
                theme={jogadorAtual?.pronto ? "ready" : "not-ready"}
              >
                {jogadorAtual?.pronto ? "Pronto!" : "Marcar como Pronto"}
              </ActionButton>
            )}
            {!isHost && (
              <ActionButton
                onClick={() => setMostrarConfirmacaoSaida(true)}
                theme="danger"
              >
                Sair da Sala
              </ActionButton>
            )}
          </div>
        </div>
        {mostrarConfirmacaoSaida && (
          <ConfirmModal
            mensagem="Deseja realmente sair da sala?"
            onConfirm={handleSairDaSala}
            onCancel={() => setMostrarConfirmacaoSaida(false)}
          />
        )}
      </div>
    </PageLayout>
  );
}
