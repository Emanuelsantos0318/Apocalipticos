import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoomProvider from './context/RoomProvider';
import App from './App';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Jogo from './pages/Jogo';
import ErrorPage from './pages/ErrorPage';
import './index.css';
import VideoBackground from './assets/VideoBackground';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <RoomProvider>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </RoomProvider>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />, // Tratamento global de erros
    children: [
      { index: true, element: <Home /> },
      { path: 'lobby/:codigo', element: <Lobby /> },
      { path: 'jogo/:codigo', element: <Jogo /> }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);