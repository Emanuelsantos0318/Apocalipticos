import React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { auth, signInAnonymously, onAuthStateChanged } from './firebase/config';
import { useAuth } from "./context/AuthContext";
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { currentUser, setCurrentUser, loading } = useAuth(); // <- pegando loading do contexto
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          const userCredential = await signInAnonymously(auth);
          firebaseUser = userCredential.user;
        }

        setCurrentUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous
        });

      } catch (authError) {
        console.error("Auth error:", authError);
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, [setCurrentUser]);

  if (navigation.state === 'loading' || loading) {
    return <LoadingScreen theme="apocalypse" />;
  }

  return (
    <div className="app-container min-h-screen">
      <Outlet />
    </div>
  );
}

export default App;
