import React, { useState } from "react";
import { FiXCircle } from "react-icons/fi"; // Ícone mais bonito
import ConfirmModal from "../modals/ConfirmModal"; // ajuste o caminho conforme sua estrutura
import toast from "react-hot-toast";

export default function PlayerList({
  jogadores,
  currentUser,
  isHost,
  sala,
  onRemoverJogador,
}) {
  const [jogadorSelecionado, setJogadorSelecionado] = useState(null);

  const confirmarRemocao = (uid) => {
    setJogadorSelecionado(uid);
  };

  const cancelarRemocao = () => {
    setJogadorSelecionado(null);
  };

const removerJogador = () => {
  if (!jogadorSelecionado) return;

  // ❌ Se o jogo já começou, bloqueia remoção
  if (sala?.estado === "em_andamento") {
    toast.error("Não é possível remover jogadores após o início do jogo.");
    setJogadorSelecionado(null);
    return;
  }

  onRemoverJogador(jogadorSelecionado);
  setJogadorSelecionado(null);
};
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Jogadores ({jogadores.length})
      </h2>
      <ul className="space-y-2">
        {jogadores.map((jogador) => (
          <li
            key={jogador.id}
            className={`flex items-center justify-between p-3 rounded ${
              jogador.id === currentUser?.uid ? "bg-gray-700" : "bg-gray-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {jogador.avatar && (jogador.avatar.startsWith("http") || jogador.avatar.includes("dicebear")) ? (
                <img 
                  src={jogador.avatar} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full bg-gray-700 object-cover border border-gray-600"
                />
              ) : (
                <span className="text-xl">{jogador.avatar || "👤"}</span>
              )}
              <span>
                {jogador.nome}
                {jogador.uid === currentUser?.uid && " (Você)"}
                {jogador.isHost && (
                  <span className="ml-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  jogador.pronto ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                {jogador.pronto ? "Pronto" : "Aguardando"}
              </span>

              {/* Botão de remover (só visível para o host e não para ele mesmo) */}
              {isHost && jogador.uid !== currentUser?.uid && (
                <button
                  onClick={() => confirmarRemocao(jogador.uid)}
                  className="text-red-400 hover:text-red-600 text-xl"
                  title="Remover jogador"
                >
                  <FiXCircle />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal simples de confirmação */}
      {jogadorSelecionado && (
        <ConfirmModal
          mensagem="Deseja realmente remover este jogador?"
          onConfirm={removerJogador}
          onCancel={cancelarRemocao}
        />
      )}
    </div>
  );
}
