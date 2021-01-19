import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import firebase from 'firebase';

interface AuthContextProps {
  children?: JSX.Element;
}

interface AuthContext {
  currentUser: firebase.User | null;
  signUp: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  login: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext>({} as AuthContext);

export function useAuth(): AuthContext {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthContextProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(() => auth.currentUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const signUp = async (email: string, password: string): Promise<firebase.auth.UserCredential> => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = async (email: string, password: string): Promise<firebase.auth.UserCredential> => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = async (): Promise<void> => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: firebase.User | null) => {
      setCurrentUser(user);
      currentUser ? setIsAuthenticated(true) : setIsAuthenticated(false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContext = { currentUser, signUp, isAuthenticated, login, logout };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
