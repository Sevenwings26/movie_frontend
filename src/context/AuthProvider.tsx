import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser } from "../api/Auth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  username?: string;
  email?: string;
  exp?: number;
  [key: string]: any;
}

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password1: string,
    password2: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser({
          username: decoded.username || decoded.email,
          email: decoded.email,
        });
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);

    if (data.access) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const decoded: DecodedToken = jwtDecode(data.access);
      setUser({
        username: decoded.username || decoded.email,
        email: decoded.email,
      });
    }
  };

  const register = async (
    username: string,
    email: string,
    password1: string,
    password2: string
  ) => {
    const data = await registerUser(username, email, password1, password2);

    if (data.access) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const decoded: DecodedToken = jwtDecode(data.access);
      setUser({
        username: decoded.username || decoded.email,
        email: decoded.email,
      });
    }
  };

  const logout = async () => {
    try {
      await logoutUser(); // optional API call if your backend supports it
    } catch (err) {
      console.warn("Backend logout failed, clearing local tokens anyway.");
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

