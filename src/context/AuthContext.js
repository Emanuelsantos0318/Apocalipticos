import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// 1. Crie o contexto
const AuthContext = createContext();

// 2. Provider
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cadastro
  const signup = async (email, password, additionalData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      ...additionalData,
      createdAt: serverTimestamp(),
      uid: userCredential.user.uid
    });

    return userCredential;
  };

  // Login
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    return await signOut(auth);
  };

  // Dados adicionais
  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Observer de auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          const { user: anonUser } = await signInAnonymously(auth);
          user = anonUser;
        }

        const userData = await fetchUserData(user.uid);
        setCurrentUser({
          ...user,
          ...userData
        });
      } catch (error) {
        console.error('Erro ao autenticar:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook personalizado
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// 4. Exportações
export {
  AuthContext,
  AuthProvider,
  useAuth
};