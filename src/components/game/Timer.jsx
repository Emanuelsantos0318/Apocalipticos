import React from "react"; // Adicione esta linha
import { useEffect, useState } from 'react';

export default function Timer({ initialTime = 30, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  return (
    <div className="timer bg-gray-800 text-white p-2 rounded-lg text-center">
      <span className="text-xl font-mono">{timeLeft}s</span>
    </div>
  );
}