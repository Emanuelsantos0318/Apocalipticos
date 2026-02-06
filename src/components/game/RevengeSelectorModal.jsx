import React from "react";
import { Skull } from "lucide-react";

export default function RevengeSelectorModal({
  isOpen,
  jogadores,
  meuUid,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500 rounded-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
          <Skull size={24} />
          ESCOLHA SUA VÍTIMA
        </h3>
        <p className="text-gray-300 mb-6 text-sm">
          Quem vai beber no seu lugar? 😈
        </p>
        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
          {jogadores
            .filter((j) => j.uid !== meuUid)
            .map((j) => (
              <button
                key={j.uid}
                onClick={() => onConfirm(j.uid)}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-red-900/40 border border-gray-700 hover:border-red-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                  {j.avatar?.startsWith("http") ? (
                    <img
                      src={j.avatar}
                      alt={j.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-lg">
                      {j.avatar}
                    </span>
                  )}
                </div>
                <span className="font-bold text-gray-200 group-hover:text-red-200 truncate">
                  {j.nome}
                </span>
              </button>
            ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-6 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
