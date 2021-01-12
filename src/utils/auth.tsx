import React, { useContext, useEffect, useState } from 'react';
import { auth } from './firebase';

interface authContextProp {
  children?: any;
}

const AuthContext = React.createContext<any | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: authContextProp) {
  const [currentUser, setCurrentUser] = useState();

  const signUp = (email: string, password: string) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, signUp };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
