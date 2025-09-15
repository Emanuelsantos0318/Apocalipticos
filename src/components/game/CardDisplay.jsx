import React from "react"; // Adicione esta linha
import { CARD_TYPES } from "../../constants/constants";

const TYPE_STYLES = {
  [CARD_TYPES.TRUTH]: "bg-blue-600 border-blue-400",
  [CARD_TYPES.DARE]: "bg-red-600 border-red-400",
  [CARD_TYPES.NEVER]: "bg-yellow-600 border-yellow-400"
};

export default function CardDisplay({ carta, timeLeft }) {
  return (
    <div className={`${TYPE_STYLES[carta.tipo]} border-4 rounded-xl p-6 mb-6 shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm uppercase font-bold tracking-wider">
          {carta.tipo === CARD_TYPES.TRUTH ? "Verdade" : 
           carta.tipo === CARD_TYPES.DARE ? "Desafio" : "Eu Nunca"}
        </span>
        <span className="text-sm">Tempo: {timeLeft}s</span>
      </div>
      
      <div className="text-center">
        <p className="text-2xl font-bold mb-4">{carta.pergunta || carta.texto}</p>
        
        {carta.tipo === CARD_TYPES.DARE && (
          <div className="bg-black bg-opacity-30 p-3 rounded-lg mt-4">
            <p className="font-semibold">Desafio:</p>
            <p>{carta.desafio}</p>
          </div>
        )}
      </div>
    </div>
  );
}