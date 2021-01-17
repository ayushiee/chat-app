import React, { useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import firebase from 'firebase';

interface AuthContextProps {
  children?: JSX.Element;
}

interface AuthContext {
  currentUser: firebase.User | null;
  signUp: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
}

const AuthContext = React.createContext<AuthContext>({} as AuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthContextProps) {
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

  const value: AuthContext = { currentUser, signUp };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
