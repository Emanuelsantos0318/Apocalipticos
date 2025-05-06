import { useEffect } from 'react';
import React from 'react';
import './App.css';
import { auth, signInAnonymously } from "./firebase/config";
import { criarSala } from "./firebase/rooms";

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importação correta


function App() {
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
    <BrowserRouter> {/* Envolvendo as rotas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:codigo" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;