import React from 'react'; // Adicione esta linha
export default function AgeVerificationModal({ isOpen, onClose, message }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg max-w-sm">
          <h3 className="text-xl font-bold text-red-500 mb-2">Restrição de Idade</h3>
          <p className="mb-4">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }