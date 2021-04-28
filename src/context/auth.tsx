// Methods for user authentication.

import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase';

import { auth, firestore } from '../utils/firebase';
import { createNewUser } from './collectionMethods';

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

  // Checks if user entry exists in collection or not. Creates new entry if user not found.
  const sendUser = async (user: firebase.User | null): Promise<void> => {
    if (!user?.uid) {
      throw new Error('Current user does not exist');
    }

    await firestore
      .collection('users')
      .doc(user?.uid)
      .get()
      .then(async docSnapshot => {
        if (docSnapshot.exists) {
          return;
        } else {
          const newUser = createNewUser(user?.uid, user?.email, '');
          await firestore.collection('users').doc(newUser.id).set(newUser);
        }
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: firebase.User | null) => {
      setCurrentUser(user);
      user && sendUser(user);
      setIsAuthenticated(!!user);
      //TODO: handle loading
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContext = { currentUser, signUp, isAuthenticated, login, logout };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
