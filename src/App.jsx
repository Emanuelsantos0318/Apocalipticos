import React, { useState, useEffect } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { auth, signInAnonymously, onAuthStateChanged } from "./firebase/config";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import WhatsNewModal from "./components/modals/WhatsNewModal";
import { latestUpdate } from "./data/updates";

function App() {
  const { currentUser, setCurrentUser, loading } = useAuth();
  const navigation = useNavigation();
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          const userCredential = await signInAnonymously(auth);
          firebaseUser = userCredential.user;
        }

        setCurrentUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } catch (authError) {
        console.error("Auth error:", authError);
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, [setCurrentUser]);

  // Check for updates
  useEffect(() => {
    const lastSeenVersion = localStorage.getItem(
      "apocalipticos_last_seen_version"
    );
    if (lastSeenVersion !== latestUpdate.version) {
      // Delay pequeno para não impactar o load inicial
      const timer = setTimeout(() => {
        setShowWhatsNew(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWhatsNew = () => {
    setShowWhatsNew(false);
    localStorage.setItem(
      "apocalipticos_last_seen_version",
      latestUpdate.version
    );
  };

  if (navigation.state === "loading" || loading) {
    return <LoadingScreen theme="apocalypse" />;
  }

  return (
    <div className="app-container min-h-screen">
      <Outlet />
      <WhatsNewModal isOpen={showWhatsNew} onClose={handleCloseWhatsNew} />
    </div>
  );
}

export default App;
