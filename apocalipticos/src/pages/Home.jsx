import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // Lógica para criar sala (Firebase)
    // Por enquanto vamos simular:
    const generatedCode = "ZUMBI"; // depois será aleatório
    navigate(`/lobby/${generatedCode}`);
  };

  const handleJoinRoom = () => {
    if (code.trim()) {
      navigate(`/lobby/${code.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-lime-400 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold text-center mb-4">💀 APOCALÍPTICOS 💥</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Sobreviva aos desafios mais absurdos com seus amigos. Ou beba tentando.
      </p>

      <button
        onClick={handleCreateRoom}
        className="bg-lime-500 text-black font-bold px-6 py-3 rounded-xl mb-6 hover:scale-105 transition"
      >
        Criar Sala
      </button>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite o código da sala"
          className="p-2 rounded text-black"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-yellow-400 px-4 rounded font-bold text-black"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
