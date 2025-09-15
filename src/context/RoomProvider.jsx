import React from 'react'; 
import { useState, createContext } from 'react';

export const RoomContext = createContext();

export default function RoomProvider({ children }) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  return (
    <RoomContext.Provider value={{
      currentRoom,
      setCurrentRoom,
      players,
      setPlayers
    }}>
      {children}
    </RoomContext.Provider>
  );
}