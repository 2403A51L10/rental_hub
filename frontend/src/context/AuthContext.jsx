import { createContext, useContext, useEffect, useState } from "react";
import { request } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "rentease_auth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { token: "", user: null };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = async (payload, isSignup = false) => {
    setLoading(true);
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const response = await request(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setAuth(response);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const refreshMe = async () => {
    if (!auth.token) return;
    const user = await request("/auth/me", {}, auth.token);
    setAuth((current) => ({ ...current, user }));
  };

  const logout = () => setAuth({ token: "", user: null });

  return (
    <AuthContext.Provider value={{ ...auth, loading, login, logout, refreshMe, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
