// components/AuthProvider.jsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken } from "../lib/auth";
import Cookies from "js-cookie";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

  useEffect(() => {
    // optional: تحقق كل فترة أو عند إعادة تحميل
    setIsLoggedIn(!!getToken());
  }, []);

  const login = (token) => {
    setIsLoggedIn(true);
  };
function generateSessionId() {
          return crypto.randomUUID(); // ولا أي مولد UUID
        }
        
        // مدة صلاحية بالميلي ثانية (مثلا 15 دقيقة)
        const SESSION_TIMEOUT = 3 * 60 * 1000; 
        
        function setSession() {
          const sessionId = Cookies.get("session_id") || generateSessionId();
          const expiryTime = Date.now() + SESSION_TIMEOUT;
        
          Cookies.set("session_id", sessionId, { path: "/" });
          Cookies.set("session_expiry", expiryTime.toString(), { path: "/" });
        }
  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
     setSession()

  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
