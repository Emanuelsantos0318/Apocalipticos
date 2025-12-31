import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSounds } from "../../hooks/useSounds";

/**
 * Hook to manage Room and Players state
 * @param {string} codigo - Room code
 * @param {string} meuUid - Current user UID
 * @returns {Object} { sala, jogadores, timeLeft, loading }
 */
export function useGameRoom(codigo, meuUid) {
  const navigate = useNavigate();
  const { playSair } = useSounds();
  
  const [sala, setSala] = useState(null);
  const [jogadores, setJogadores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);

  // Listener da Sala
  useEffect(() => {
    if (!codigo) return;
    const unsub = onSnapshot(doc(db, "salas", codigo), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSala(data);
        if (data.timeLeft !== undefined) setTimeLeft(data.timeLeft);

        // Redirecionar para o Lobby se o estado for 'waiting'
        // IMPORTANTE: Adicionamos verificação para evitar loop se já estivermos saindo
        if (data.status === "waiting" || data.estado === "waiting") {
          navigate(`/lobby/${codigo}`);
        }
      } else {
        navigate("/"); // Sala excluída ou inválida
      }
      setLoading(false);
    });
    return () => unsub();
  }, [codigo, navigate]);

  // Listener de Jogadores
  const prevJogadoresRef = useRef([]);

  useEffect(() => {
    if (!codigo) return;
    const q = collection(db, "salas", codigo, "jogadores");
    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      // Detectar quem saiu
      if (prevJogadoresRef.current.length > 0) {
        const currentUids = lista.map((p) => p.uid);
        const saiu = prevJogadoresRef.current.filter(
          (p) => !currentUids.includes(p.uid)
        );
        saiu.forEach((p) => {
           // Só avisa se não for "Eu" que saí (para evitar flood se eu sair)
           if (p.uid !== meuUid) {
             toast.error(`${p.nome} saiu da sala.`);
             playSair();
           }
        });
      }

      prevJogadoresRef.current = lista;
      setJogadores(lista);
    });
    return () => unsub();
  }, [codigo, meuUid, playSair]);

  return { sala, jogadores, timeLeft, setTimeLeft, loading };
}
