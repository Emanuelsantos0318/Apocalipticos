import React from 'react'; // Adicione esta linha
import { createContext } from 'react';

const RoomContext = createContext({
  currentRoom: null,
  setCurrentRoom: () => {},
  players: [],
  setPlayers: () => {}
});

export default RoomContext;