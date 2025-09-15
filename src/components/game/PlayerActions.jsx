import React from "react"; // Adicione esta linha
export default function PlayerActions({ onComplete, onPenalidade, cardType }) {
    return (
      <div className="flex justify-center gap-4 mb-6">
        {cardType === "verdadeDesafio" ? (
          <>
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold"
            >
              Completei!
            </button>
            <button
              onClick={onPenalidade}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold"
            >
              Recusar (Beber)
            </button>
          </>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
          >
            Confirmar Ação
          </button>
        )}
      </div>
    );
  }