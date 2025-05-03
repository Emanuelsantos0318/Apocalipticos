//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
//import Lobby from './pages/Lobby.jsx'; // (você vai criar depois)
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:roomCode" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
