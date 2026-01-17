import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChaosEventOverlay({
  sala,
  jogadores, // Added prop
  meuUid,
  gameActions,
  setCustomRole,
  setShowAbilityModal,
}) {
  if (!sala?.cartaAtual || sala.cartaAtual.tipo !== "CAOS" || !jogadores)
    return null;

  const isCurrentPlayer = sala.jogadorAtual === meuUid;
  const isHost = jogadores.find((j) => j.uid === meuUid)?.isHost;
  const canInteract = isCurrentPlayer || isHost;

  const event = sala.cartaAtual;

  // -- RENDERERS --

  // -- SUB-COMPONENTS (Could be extracted later) --

  const VotingOption = ({ title, icon, color, onClick, isSelected }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-6 rounded-xl border-4 flex flex-col items-center gap-3 transition-all ${
        isSelected
          ? `border-${color}-400 bg-${color}-900/80 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]`
          : `border-${color}-800/50 bg-black/60 hover:bg-${color}-900/40 text-gray-400 grayscale hover:grayscale-0`
      }`}
    >
      <div className={`text-5xl ${isSelected ? "animate-bounce" : ""}`}>
        {icon}
      </div>
      <h3 className={`font-black text-xl text-${color}-400 tracking-wider`}>
        {title}
      </h3>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-white text-black text-xs font-bold px-2 py-1 rounded-full">
          SEU VOTO
        </div>
      )}
    </motion.button>
  );

  const CoinFlip = ({ onFlip }) => {
    const [flipping, setFlipping] = React.useState(false);

    // Check if I already flipped
    const myFlip = sala.activeEventState?.flips?.[meuUid];

    const handleFlip = () => {
      if (flipping || myFlip) return;
      setFlipping(true);

      const result = Math.random() > 0.5 ? "HEADS" : "TAILS";

      setTimeout(() => {
        setFlipping(false);
        onFlip(result, meuUid);
      }, 2000); // 2s animation
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-32 h-32 rounded-full border-4 border-yellow-500 bg-yellow-300 flex items-center justify-center text-5xl shadow-[0_0_30px_#EAB308] ${
            flipping ? "animate-[spin_0.5s_linear_infinite]" : ""
          }`}
        >
          {myFlip ? (myFlip === "HEADS" ? "😇" : "☠️") : flipping ? "😵‍💫" : "🪙"}
        </div>

        {!myFlip && !flipping && (
          <button
            onClick={handleFlip}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-black rounded-full shadow-lg"
          >
            GIRAR MOEDA
          </button>
        )}

        {myFlip && (
          <p
            className={`font-bold text-xl ${
              myFlip === "HEADS" ? "text-green-400" : "text-red-500"
            }`}
          >
            {myFlip === "HEADS" ? "CARA: SALVO!" : "COROA: 3 DOSES!"}
          </p>
        )}
      </div>
    );
  };

  const renderGula = () => {
    const currentState = sala.activeEventState || {}; // { phase: 'VOTING' | 'COIN_FLIP' | 'RESULT_SAFETY', votes: {}, flips: {} }

    // Default to Voting if not set (legacy handling or immediate init)
    if (!currentState.phase || currentState.phase === "VOTING") {
      const myVote = currentState.votes?.[meuUid];

      return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
          <div className="text-center">
            <h3 className="text-orange-400 font-bold text-3xl mb-2 drop-shadow-md">
              BANQUETE TÓXICO
            </h3>
            <p className="text-gray-300 text-sm italic">
              "A fome é a pior conselheira..."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            {/* OPTION A: SAFETY */}
            <VotingOption
              title="SEGURANÇA"
              icon="🛡️"
              color="blue"
              isSelected={myVote === "SAFETY"}
              onClick={() => gameActions.handleChaosVote("SAFETY")}
            />

            {/* OPTION B: RISK */}
            <VotingOption
              title="RISCO"
              icon="🥩"
              color="red"
              isSelected={myVote === "RISK"}
              onClick={() => gameActions.handleChaosVote("RISK")}
            />
          </div>

          <div className="bg-black/50 px-4 py-2 rounded text-xs text-gray-400">
            Votos computados: {Object.keys(currentState.votes || {}).length} /{" "}
            {jogadores.length}
          </div>

          {/* Fallback Legacy Trigger (Just in case state is stuck) */}
          {!currentState.phase && canInteract && (
            <button
              onClick={gameActions.handleBanquet}
              className="text-xs text-gray-600 underline"
            >
              Forçar Início
            </button>
          )}
        </div>
      );
    }

    if (currentState.phase === "RESULT_SAFETY") {
      return (
        <div className="text-center animate-pulse">
          <h3 className="text-blue-400 font-bold text-2xl">
            A MAIORIA ESCOLHEU SEGURANÇA!
          </h3>
          <p className="text-white mt-2">Todos dividem o pão (e a conta).</p>
          <div className="text-4xl mt-4">🍞 -1 Dose</div>
        </div>
      );
    }

    if (currentState.phase === "COIN_FLIP") {
      return (
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-red-500 font-bold text-2xl animate-pulse">
            O RISCO VENCEU!
          </h3>
          <p className="text-gray-300 text-sm text-center max-w-md">
            A ganância falou mais alto. Quem tirar Coroa bebe O TRIPLO.
          </p>
          <div className="mt-4">
            <CoinFlip onFlip={gameActions.handleCoinFlipResult} />
          </div>
          <div className="text-xs text-gray-500 mt-4">
            Aguardando todos girarem...
          </div>
        </div>
      );
    }
  };

  const renderIra = () => {
    return (
      canInteract && (
        <button
          onClick={() => {
            setCustomRole({
              id: "carrasco",
              name: "Senhor da Ira",
              icon: "⚔️",
              image:
                "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=500&auto=format&fit=crop&q=60",
              ability: {
                name: "Desafiar para Duelo",
                effect:
                  "Escolha alguém para duelar com você. Perdedor bebe em dobro!",
                cost: "Gratuito",
              },
              needsTarget: true,
            });
            setShowAbilityModal(true);
          }}
          className="px-6 py-2 bg-red-800 hover:bg-red-900 rounded font-bold flex items-center gap-2"
        >
          <span className="text-xl">⚔️</span> DUELO (Escolher Alvo)
        </button>
      )
    );
  };

  const renderGenericChaos = () => {
    return (
      canInteract && (
        <button
          onClick={gameActions.handleAdminConfirm}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-bold flex items-center gap-2"
        >
          <span className="text-xl">{event.icon}</span> ATIVAR{" "}
          {event.name.split(" - ")[0].toUpperCase()}
        </button>
      )
    );
  };

  const renderLuxuria = () => {
    // Verificar se sou o proprietário deste evento Luxúria
    // O evento em sala.cartaAtual é o modelo.
    // Precisamos verificar activeEvents para ver se já vinculei alguém.
    // No entanto, para o turno inicial, o evento É sala.cartaAtual E está em activeEvents (adicionado via lógica handleAdminConfirm, potencialmente? Não, Luxúria é adicionado de forma diferente).
    // Espere, Luxúria é um evento GLOBAL/PERSISTENTE.
    // Se for o TURNO em que ele surgiu, o USUÁRIO deve escolher.
    // Lógica: Se eu sou o proprietário e ainda não escolhi (linkedTo é nulo/indefinido em activeEvents para ESTE ID/Instância do evento), mostrar botão.

    if (!canInteract) return null;

    const myLustEvent = sala.activeEvents?.find(
      (e) => e.id === "LUXURIA" && e.owner === meuUid
    );
    const hasLinked = myLustEvent?.linkedTo;

    if (hasLinked) {
      const partnerName =
        jogadores.find((j) => j.uid === hasLinked)?.nome || "Parceiro";
      return (
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <h3 className="text-pink-500 font-bold text-xl">
            VÍNCULO ESTABELECIDO 💋
          </h3>
          <p className="text-white text-sm">Você e {partnerName} são um só.</p>
          <div className="text-xs text-gray-400">
            (O botão sumiu porque o pacto foi selado)
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => {
          setCustomRole({
            id: "parceiro_luxuria",
            name: "Amante",
            icon: "💋",
            image:
              "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=500&auto=format&fit=crop&q=60",
            ability: {
              name: "Realizar Pacto",
              effect:
                "Escolha um parceiro. Dano recebido é compartilhado (50%). Cuidado com a traição!",
              cost: "Gratuito",
            },
            needsTarget: true, // This triggers the Modal
          });
          setShowAbilityModal(true);
        }}
        className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded font-bold flex items-center gap-2 animate-pulse"
      >
        <span className="text-xl">💋</span> ESCOLHER PARCEIRO
      </button>
    );
  };

  return (
    <div className="w-full flex justify-center mt-4 p-4 border-2 border-purple-500/30 rounded-lg bg-black/40 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        {(event.id === "GULA" || event.name?.toUpperCase().includes("GULA")) &&
          renderGula()}
        {(event.id === "IRA" || event.name?.toUpperCase().includes("IRA")) &&
          renderIra()}
        {(event.id === "LUXURIA" ||
          event.name?.toUpperCase().includes("LUXURIA") ||
          event.name?.toUpperCase().includes("LUXÚRIA")) &&
          renderLuxuria()}

        {(event.type === "GLOBAL_EFFECT" ||
          event.type === "PERSISTENT_EFFECT") &&
          !event.name?.toUpperCase().includes("IRA") &&
          !event.name?.toUpperCase().includes("LUXURIA") &&
          !event.name?.toUpperCase().includes("LUXÚRIA") &&
          renderGenericChaos()}

        {/* Cancel Option always available for Admin/Host as failsafe */}
        {isHost && (
          <button
            onClick={gameActions.handleAdminReject}
            className="px-4 py-2 bg-gray-600/50 hover:bg-gray-700/50 rounded text-xs mt-2"
          >
            Cancelar Evento
          </button>
        )}
      </div>
    </div>
  );
}
