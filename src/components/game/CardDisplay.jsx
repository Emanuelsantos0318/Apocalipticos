import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CARD_TYPES } from "../../constants/constants";

const TYPE_STYLES = {
  [CARD_TYPES.TRUTH]: "bg-blue-600 border-blue-400 shadow-blue-500/50",
  [CARD_TYPES.DARE]: "bg-red-600 border-red-400 shadow-red-500/50",
  [CARD_TYPES.NEVER]: "bg-yellow-600 border-yellow-400 shadow-yellow-500/50",
  [CARD_TYPES.FRIENDS]: "bg-purple-600 border-purple-400 shadow-purple-500/50",
  [CARD_TYPES.DECISIONS]: "bg-green-600 border-green-400 shadow-green-500/50",
  [CARD_TYPES.DO_OR_DRINK]:
    "bg-orange-600 border-bronw-400 shadow-orange-500/50",
  [CARD_TYPES.THIS_OR_THAT]: "bg-pink-600 border-pink-400 shadow-pink-500/50",
  CAOS: "bg-gray-900 border-red-600 shadow-red-900/100 animate-pulse", // Estilo do Caos
};

export default function CardDisplay({ carta, timeLeft, activeEvents }) {
  // Filter relevant global events to show (persistent/global)
  const activeChaos =
    activeEvents?.filter(
      (e) =>
        (e.type === "GLOBAL_EFFECT" || e.type === "PERSISTENT_EFFECT") &&
        e.duration > 0,
    ) || [];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={carta.id || carta.texto}
        initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
        animate={{ rotateY: 0, opacity: 1, scale: 1 }}
        exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`${
          TYPE_STYLES[carta.tipo] || "bg-gray-600 border-gray-400"
        } border-4 rounded-xl p-4 mb-6 shadow-2xl transform-gpu backface-hidden relative overflow-hidden`}
      >
        {/* EVENT BADGE OVERLAY */}
        {activeChaos.length > 0 && (
          <div className="absolute top-0 left-0 w-full flex flex-col items-center pointer-events-none z-10">
            {activeChaos.map((ev, i) => (
              <div
                key={i}
                className={`w-full text-center py-1 text-[10px] uppercase font-bold tracking-widest text-white shadow-md animate-pulse ${
                  ev.color || "bg-gray-900"
                }`}
              >
                ⚡ {ev.icon} {ev.name} ({ev.duration} Rodadas) ⚡
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-start mb-3 mt-2">
          <span className="text-sm uppercase font-bold tracking-wider opacity-80">
            {carta.tipo === CARD_TYPES.TRUTH
              ? "Verdade"
              : carta.tipo === CARD_TYPES.DARE
                ? "Desafio"
                : carta.tipo === CARD_TYPES.NEVER
                  ? "Eu Nunca"
                  : carta.tipo === CARD_TYPES.FRIENDS
                    ? "Amigos de Merda"
                    : carta.tipo === CARD_TYPES.DECISIONS
                      ? "Decisões de Merda"
                      : carta.tipo === CARD_TYPES.DO_OR_DRINK
                        ? "Faz ou Bebe"
                        : carta.tipo === CARD_TYPES.THIS_OR_THAT
                          ? "Isso ou Aquilo"
                          : carta.tipo === "CAOS"
                            ? "⚡ EVENTO DO CAOS ⚡"
                            : "Carta"}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full animate-pulse ${
                timeLeft < 10 ? "bg-red-500" : "bg-green-500"
              }`}
            ></div>
            <span className="text-sm font-mono">{timeLeft}s</span>
          </div>
        </div>

        <div className="text-center py-4">
          {carta.tipo === "CAOS" && (
            <div className="mb-6 animate-in zoom-in duration-500">
              <div className="text-6xl mb-3 filter drop-shadow-lg animate-bounce">
                {carta.icon || "🔥"}
              </div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 uppercase tracking-widest drop-shadow-sm">
                {carta.name}
              </h2>
            </div>
          )}

          <p className="text-2xl font-bold mb-4 drop-shadow-md">
            {carta.pergunta || carta.texto}
          </p>

          {carta.tipo === CARD_TYPES.DARE && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              delay={0.3}
              className="bg-black/40 backdrop-blur-sm p-4 rounded-lg mt-4 border border-white/10"
            >
              <p className="font-semibold text-red-300 mb-1">Desafio:</p>
              <p className="italic">{carta.desafio}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
