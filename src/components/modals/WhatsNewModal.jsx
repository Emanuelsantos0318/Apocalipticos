import React from "react";
import ActionButton from "../buttons/ActionButton";
import { latestUpdate } from "../../data/updates";
import { X, Sparkles, Shield, User } from "lucide-react"; // Ícones sugeridos, ajuste conforme disponibilidade

// Componente simples para renderizar ícones baseados no título (opcional, pode ser estático)
const getIconForChange = (index) => {
  const icons = ["🔐", "✨", "📜", "🎮", "🐛"];
  return icons[index % icons.length];
};

export default function WhatsNewModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 px-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-primary-500/50 p-6 rounded-2xl text-left max-w-lg w-full shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] relative flex flex-col max-h-[90vh]">
        {/* Header com brilho */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-70"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span className="text-primary-400">🚀</span> {latestUpdate.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-300 mb-6 font-medium">{latestUpdate.intro}</p>

        {/* Scroll area para lista de mudanças */}
        <div className="flex-1 overflow-y-auto pr-2 mb-6 space-y-4 custom-scrollbar">
          {latestUpdate.changes.map((change, index) => (
            <div
              key={index}
              className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-primary-500/30 transition-all hover:bg-gray-800"
            >
              <h3 className="font-bold text-primary-300 mb-1 flex items-center gap-2">
                <span>{getIconForChange(index)}</span>
                {change.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {change.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-2 text-center">
          <p className="text-xs text-gray-500 mb-4 italic">
            {latestUpdate.footer}
          </p>
          <div className="w-full">
            <ActionButton onClick={onClose} theme="primary">
              Entendi, vamos jogar!
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
