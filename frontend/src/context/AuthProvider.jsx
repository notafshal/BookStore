import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout request failed:", err.message);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = async (payload) => {
    await api.post("/register", payload);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
