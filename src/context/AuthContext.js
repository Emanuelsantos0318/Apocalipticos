import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  updateProfile,
  signInWithCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// 1. Crie o contexto
const AuthContext = createContext();

// 2. Provider
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Cria um novo usuário no Firebase Auth e salva dados adicionais no Firestore.
   */
  const signup = async (email, password, additionalData) => {
    // Se o usuário já é anônimo, tentamos VINCULAR a conta em vez de criar uma do zero
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      try {
        // OBS: linkWithCredential precisa de credencial, mas linkWithPopup não está disponível para Email/Senha diretamente simplificado
        // Para Email/Senha, o fluxo padrão é criar o usuário.
        // Se fizermos createUserWithEmailAndPassword, o auth muda para o novo user. O anônimo é perdido se não fizermos merge manual ou link.
        // O Firebase não permite linkar email/senha em conta anônima facilmente sem `EmailAuthProvider.credential`.
        // Para simplificar: Vamos criar a conta nova e copiar os dados se necessário, ou apenas criar nova.
        // O usuário pediu "Cadastro", então vamos seguir o fluxo padrão de Criar.
        // Para "Manter" o anônimo, teríamos que usar linkWithCredential(auth.currentUser, EmailAuthProvider.credential(email, password))
        // Mas isso é complexo na UI. Vamos assumir cadastro limpo por enquanto OU implementar link se sobrar tempo.
        // Update: Vamos fazer cadastro limpo (novo UID).
      } catch (e) {
        console.error(e);
      }
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: additionalData.nome,
    });

    await setDoc(doc(db, "users", user.uid), {
      email,
      ...additionalData,
      createdAt: serverTimestamp(),
      uid: user.uid,
      photoURL: user.photoURL || additionalData.avatar || null,
    });

    return userCredential;
  };

  /**
   * Login com Google (Suporta Link de Conta)
   */
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        // Tenta vincular conta anônima à conta Google
        try {
          const result = await linkWithPopup(auth.currentUser, provider);
          // Atualiza dados no Firestore
          await setDoc(
            doc(db, "users", result.user.uid),
            {
              email: result.user.email,
              nome: result.user.displayName,
              photoURL: result.user.photoURL,
              uid: result.user.uid,
              linkedFromAnonymous: true,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
          return result;
        } catch (linkError) {
          if (linkError.code === "auth/credential-already-in-use") {
            // A conta Google já existe.
            // Tenta logar diretamente usando a credencial retornada no erro (evita novo popup)
            const credential =
              GoogleAuthProvider.credentialFromError(linkError);
            if (credential) {
              return await signInWithCredential(auth, credential);
            } else {
              // Se não houver credencial (raro), não podemos chamar signInWithPopup automaticamente pois será bloqueado.
              // Melhor lançar um erro específico para a UI pedir login normal.
              throw new Error(
                "Conta Google já existe. Por favor, faça login novamente para trocar de conta."
              );
            }
          }
          throw linkError;
        }
      } else {
        // Login normal
        const result = await signInWithPopup(auth, provider);
        // Garante que o doc do usuário existe
        const docRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            email: result.user.email,
            nome: result.user.displayName,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
            createdAt: serverTimestamp(),
          });
        }
        return result;
      }
    } catch (error) {
      console.error("Erro no Google Login:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          // Se não tem usuário, cria um anônimo automaticamente (padrão do App)
          const { user: anonUser } = await signInAnonymously(auth);
          user = anonUser;
        }

        const userData = await fetchUserData(user.uid);

        // Se for anônimo e não tiver dados no Firestore, usa defaults
        const finalUser = {
          ...user,
          ...userData,
          displayName:
            userData?.nome ||
            user.displayName ||
            (user.isAnonymous ? "Anônimo" : "Jogador"),
          isAnonymous: user.isAnonymous,
        };

        setCurrentUser(finalUser);
      } catch (error) {
        console.error("Erro ao autenticar:", error);
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
    loginWithGoogle,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Hook personalizado
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

// 4. Exportações
export { AuthContext, AuthProvider, useAuth };
