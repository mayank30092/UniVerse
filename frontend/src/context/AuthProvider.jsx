import { useState, useEffect } from "react";
import axios from "axios"; // Add this import
import { AuthContext } from "./AuthContext";

// Helper function - ADD THIS
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token:", e);
    return {};
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token && role && name) {
      const decoded = parseJwt(token);
      console.log("Decoded token:", decoded);
      const _id = decoded.id || decoded._id || decoded.userId;
      // ADD EMAIL HERE
      setUser({
        token,
        role,
        name,
        _id,
        email: decoded.email, // ⬅️ ADD THIS LINE
      });
    }

    setLoading(false);
  }, []);

  // Also update your login function to store email
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, role, name } = res.data;

      // Decode to get email
      const decoded = parseJwt(token);

      setUser({
        token,
        role,
        name,
        _id: decoded.id,
        email: decoded.email, // ⬅️ ADD THIS
      });

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
