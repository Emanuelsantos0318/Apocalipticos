import React from "react";
import ActionButton from "../buttons/ActionButton";

export default function ConfirmModal({ isOpen = true, title, message, mensagem, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl text-center max-w-sm w-full shadow-2xl relative">
        {title && <h3 className="text-xl font-bold text-white mb-2">{title}</h3>}
        <p className="mb-6 text-gray-300">{message || mensagem}</p>
        
        <div className="flex justify-center gap-4">
          <div className="w-32">
            <ActionButton onClick={onConfirm} theme="danger">
              Sim
            </ActionButton>
          </div>
          <div className="w-32">
            <ActionButton onClick={onCancel} theme="secondary">
              Cancelar
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
