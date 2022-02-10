import React, { useState, useEffect, useContext, createContext } from "react";
import nookies from "nookies";
import firebaseClient from "./firebaseClient";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { signIn } from "../services/authService";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  firebaseClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, "token", "", {});
        setLoading(false);
        return;
      }
      const token = await user.getIdToken(true);
      const data = await signIn(token);
      const userData = {
        uid: user.uid,
        email: user.email,
        token,
        ...data,
      };
      setUser(userData);
      setLoading(false);
      nookies.set(undefined, "token", token, {});
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
