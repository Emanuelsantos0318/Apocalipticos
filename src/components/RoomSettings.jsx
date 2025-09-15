import React from 'react'; // Adicione esta linha
import { getModeRules } from "../constants/gameRules";

export default function RoomSettings({ mode }) {
  const rules = getModeRules(mode);
  
  return (
    <div>
      <h3>Regras para o modo {mode}:</h3>
      <p>Jogadores máximos: {rules.maxPlayers}</p>
    </div>
  );
}