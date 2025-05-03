import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { auth, signInAnonymously } from "./firebase/config";
import { criarSala } from "./firebase/rooms";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log("Usuário logado anonimamente");
        const uid = userCredential.user.uid;
        criarSala(uid, "hardcore").then((codigo) => {
          console.log("Sala criada com código:", codigo);
        });
      })
      .catch((error) => console.error("Erro no login:", error));
  }, []);

  return (
    <div className="text-center mt-10 text-white">
      <h1 className="text-3xl font-bold mb-4">Apocalípticos!</h1>

      <div className="flex justify-center gap-4 mb-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          Contador: {count}
        </button>
        <p className="mt-2 text-sm">
          Edit <code>src/App.jsx</code> e salve para testar o HMR.
        </p>
      </div>

      <p className="read-the-docs mt-4">
        Clique nos logos para saber mais.
      </p>

      <div className="mt-4">Criando sala... Veja o console!</div>
    </div>
  );
}

export default App;
