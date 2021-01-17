import React, { useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import firebase from 'firebase';

interface AuthContextProp {
  children?: any;
}

const AuthContext = React.createContext<any | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthContextProp) {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(() => auth.currentUser);

  const signUp = async (email: string, password: string): Promise<firebase.auth.UserCredential> => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: firebase.User | null) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, signUp };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
