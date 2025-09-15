// GameHeader.jsx
import React from "react"; // Adicione esta linha
export const GameHeader = ({ codigo, modo, currentPlayer, isCurrentPlayer }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <header>
      <h2 className="text-xl font-bold">Código: {codigo}</h2>
      <p>Modo: {modo}</p>
      <p>Vez: {isCurrentPlayer ? "Sua vez!" : `Jogador: ${currentPlayer}`}</p>
      </header>
    </div>
  );
};