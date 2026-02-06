import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoomProvider from "./context/RoomProvider";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import "./index.css";
import VideoBackground from "./assets/VideoBackground";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "./components/LoadingScreen";

// Lazy loading das páginas
const LandingPage = React.lazy(() => import("./pages/landing/LandingPage"));
const Home = React.lazy(() => import("./pages/Home"));
const Lobby = React.lazy(() => import("./pages/Lobby"));
const Jogo = React.lazy(() => import("./pages/Jogo"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <RoomProvider>
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: "#1f2937", // gray-800
                color: "#fff",
                border: "1px solid #374151", // gray-700
                padding: "16px",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981", // emerald-500
                  secondary: "#fff",
                },
                style: {
                  border: "1px solid #10b981",
                  boxShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444", // red-500
                  secondary: "#fff",
                },
                style: {
                  border: "1px solid #ef4444",
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.2)",
                },
              },
            }}
          />
        </RoomProvider>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<LoadingScreen theme="apocalypse" />}>
            <LandingPage />
          </React.Suspense>
        ),
      },
      {
        path: "app",
        element: (
          <React.Suspense fallback={<LoadingScreen theme="apocalypse" />}>
            <Home />
          </React.Suspense>
        ),
      },
      {
        path: "lobby/:codigo",
        element: (
          <React.Suspense fallback={<LoadingScreen theme="apocalypse" />}>
            <Lobby />
          </React.Suspense>
        ),
      },
      {
        path: "jogo/:codigo",
        element: (
          <React.Suspense fallback={<LoadingScreen theme="apocalypse" />}>
            <Jogo />
          </React.Suspense>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
