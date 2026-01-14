import React, { useState } from "react";
import { X, Check, Droplets } from "lucide-react";
import { ROLES } from "../../constants/roles";

export default function ClassAbilityModal({
  isOpen,
  onClose,
  userRoleKey,
  customRole, // New prop
  jogadores,
  meuUid,
  onUseAbility,
}) {
  const [selectedTarget, setSelectedTarget] = useState(null);

  if (!isOpen) return null;

  // Encontra objeto da Role ou usa CustomRole
  const role =
    customRole || Object.values(ROLES).find((r) => r.id === userRoleKey);

  if (!role) return null;

  const needsTarget =
    role.needsTarget ||
    ["medico", "assassino", "incendiaria", "estrategista"].includes(role.id);

  const handleConfirm = () => {
    if (needsTarget && !selectedTarget) return;
    onUseAbility(meuUid, role.id, selectedTarget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header com a Cor/Tema da Classe */}
        <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 relative">
          <img
            src={role.image}
            alt={role.name}
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 -mt-10 relative">
          {/* Ícone e Título */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 border-4 border-gray-700 shadow-xl flex items-center justify-center text-4xl mb-3">
              {role.icon}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {role.ability.name}
            </h2>
            <span className="text-purple-400 font-medium text-sm uppercase tracking-widest">
              {role.name}
            </span>
          </div>

          {/* Descrição e Custo */}
          <div className="mt-6 space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-300 text-sm italic">
                "{role.ability.effect}"
              </p>
            </div>

            <div className="flex items-center gap-3 text-red-400 bg-red-900/10 p-3 rounded-lg border border-red-900/30">
              <Droplets size={20} />
              <div>
                <p className="text-xs font-bold uppercase opacity-70">Custo</p>
                <p className="font-bold text-sm">{role.ability.cost}</p>
              </div>
            </div>
          </div>

          {/* Seleção de Alvo (Se necessário) */}
          {needsTarget && (
            <div className="mt-6">
              <p className="text-gray-400 text-xs uppercase font-bold mb-2">
                Selecione o Alvo:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {jogadores
                  .filter((j) => j.uid !== meuUid) // Prevent self-target
                  .map((j) => (
                    <button
                      key={j.uid}
                      onClick={() => setSelectedTarget(j.uid)}
                      className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                        selectedTarget === j.uid
                          ? "bg-purple-600 border-purple-400 scale-105 shadow-lg shadow-purple-900/50"
                          : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden mb-1">
                        {j.avatar && j.avatar.startsWith("http") ? (
                          <img
                            src={j.avatar}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="flex items-center justify-center h-full text-xs">
                            {j.avatar}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white truncate w-full text-center">
                        {j.uid === meuUid ? "Você" : j.nome}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Botão de Ação ou Indicador de Passiva */}
          {role.id === "sobrevivente" ? (
            <div className="w-full mt-8 py-4 bg-gray-800 border border-gray-600 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-80">
              <Check size={20} />
              HABILIDADE PASSIVA
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={needsTarget && !selectedTarget}
              className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform transition-all active:scale-95"
            >
              <Check size={20} />
              CONFIRMAR HABILIDADE
            </button>
          )}

          <p className="text-center text-[10px] text-gray-500 mt-2">
            {role.id === "sobrevivente"
              ? "Ativa automaticamente quando o HP chegar a 0."
              : "Esta ação não pode ser desfeita."}
          </p>
        </div>
      </div>
    </div>
  );
}
