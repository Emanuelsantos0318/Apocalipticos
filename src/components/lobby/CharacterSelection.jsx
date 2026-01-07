import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLE_LIST } from "../../constants/roles";

export default function CharacterSelection({ onSelect, selectedRole }) {
  const [focusedRole, setFocusedRole] = useState(selectedRole || null);

  const handleSelect = (roleId) => {
    setFocusedRole(roleId);
    if (onSelect) onSelect(roleId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center neon-text">
        Escolha seu Personagem
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {ROLE_LIST.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              onClick={() => handleSelect(role.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all overflow-hidden
                ${
                  isSelected
                    ? "border-purple-500 bg-purple-900/40 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    : "border-white/10 bg-black/40 hover:border-white/30"
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-purple-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Background Image (Optional) */}
              <div
                className="absolute inset-0 bg-cover bg-center z-0 opacity-20 transition-opacity hover:opacity-40"
                style={{ backgroundImage: `url(${role.image})` }}
              />

              {/* Content Overlay */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl bg-black/50 w-12 h-12 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    {role.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white shadow-black drop-shadow-lg">
                      {role.name}
                    </h3>
                    <span className="text-xs text-gray-300 uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded">
                      Classe
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-200">
                  <p className="italic text-xs text-gray-400 mb-2">
                    "{role.lore}"
                  </p>

                  <div className="bg-black/60 p-2 rounded border border-white/10 backdrop-blur-md">
                    <p className="font-bold text-purple-300 text-xs uppercase mb-1">
                      Habilidade: {role.ability.name}
                    </p>
                    <p className="leading-tight mb-1 font-medium">
                      {role.ability.effect}
                    </p>
                    <p className="text-xs text-red-300">
                      Custo: {role.ability.cost}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
