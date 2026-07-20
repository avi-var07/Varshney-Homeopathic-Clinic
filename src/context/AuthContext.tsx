"use client";

import {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from "react";

export interface PatientUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: PatientUser | null;
  loading: boolean;
  showLogin: boolean;
  loginMode: "patient" | "reauth";
  openLogin: (mode?: "patient" | "reauth") => void;
  closeLogin: () => void;
  logout: () => Promise<void>;
  setUser: (u: PatientUser | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  showLogin: false,
  loginMode: "patient",
  openLogin: () => {},
  closeLogin: () => {},
  logout: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PatientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<"patient" | "reauth">("patient");

  // Verify patient session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        // Only set patient users in this context — doctor has separate login
        if (data?.user && data.user.role === "patient") {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openLogin = useCallback(
    (mode: "patient" | "reauth" = "patient") => {
      setLoginMode(mode);
      setShowLogin(true);
    },
    []
  );

  const closeLogin = useCallback(() => setShowLogin(false), []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, showLogin, loginMode, openLogin, closeLogin, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
