import React from 'react'; // <-- NECESSÁRIO para usar JSX
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import { useEffect, useState } from 'react';
import { auth, signInAnonymously } from './firebase/config';

function App() {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    signInAnonymously(auth)
      .then((userCredential) => {
        setUid(userCredential.user.uid);
      })
      .catch(console.error);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home uid={uid} />} />
      <Route path="/lobby/:codigo" element={<Lobby />} />
    </Routes>
  );
}

export default App;