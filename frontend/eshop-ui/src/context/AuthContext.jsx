import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi, getMe } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    localStorage.setItem("token", response.data.token);
    const meResponse = await getMe();
    setUser(meResponse.data);
    return response;
  };

  const register = async (userData) => {
    const response = await registerApi(userData);
    localStorage.setItem("token", response.data.token);
    const meResponse = await getMe();
    setUser(meResponse.data);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
