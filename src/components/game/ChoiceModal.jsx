import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CARD_TYPES } from "../../constants/constants";

export default function ChoiceModal({ isOpen, onChoice, timeLeft }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            className="w-full max-w-lg"
          >
            <h2 className="text-3xl font-bold text-center text-white mb-8 drop-shadow-lg">
              Sua vez de escolher! 😈
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => onChoice(CARD_TYPES.TRUTH)}
                className="w-full sm:w-48 h-48 rounded-2xl bg-blue-600 hover:bg-blue-500 border-4 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-4 group"
              >
                <span className="text-6xl group-hover:scale-110 transition-transform">😇</span>
                <span className="text-2xl font-black uppercase text-white tracking-wider">Verdade</span>
              </button>
              
              <div className="flex flex-col items-center justify-center">
                <span className="text-gray-400 font-bold text-sm uppercase mb-2">Tempo</span>
                <div className={`text-4xl font-mono font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {timeLeft}
                </div>
              </div>

              <button
                onClick={() => onChoice(CARD_TYPES.DARE)}
                className="w-full sm:w-48 h-48 rounded-2xl bg-red-600 hover:bg-red-500 border-4 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-4 group"
              >
                <span className="text-6xl group-hover:scale-110 transition-transform">😈</span>
                <span className="text-2xl font-black uppercase text-white tracking-wider">Desafio</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
