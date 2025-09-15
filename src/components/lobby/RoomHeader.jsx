import React from "react"; // Adicione esta linha
import { GAME_MODES } from "../../constants/constants";

const MODE_STYLES = {
  [GAME_MODES.NORMAL]: "bg-green-600",
  [GAME_MODES.ADULTO]: "bg-red-600",
  [GAME_MODES.DIFICIL]: "bg-yellow-600"
};

export default function RoomHeader({ codigo, modo, isHost }) {
  return (
    <div className="mb-6">
      <div className={`${MODE_STYLES[modo]} p-3 rounded-lg`}>
        <h1 className="text-2xl font-bold">Sala: {codigo}</h1>
        <div className="flex justify-between items-center">
          <span className="text-sm uppercase tracking-wider">
            Modo: {modo}
          </span>
          {isHost && (
            <span className="text-xs bg-black px-2 py-1 rounded">
              Administrador
            </span>
          )}
        </div>
      </div>
    </div>
  );
}