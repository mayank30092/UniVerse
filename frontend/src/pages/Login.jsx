import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { parseJwt } from "../utils/helpers";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Enhanced login component with debugging
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🔄 Frontend login attempt:");
      console.log("Email:", email);
      console.log("Password length:", password.length);

      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Login response:", res.data);

      const { token, role, name, _id } = res.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      // Decode token to get all user data
      const decoded = parseJwt(token);
      console.log("🔍 Decoded token in frontend:", decoded);

      // Update context with ALL user data
      setUser({
        token,
        role,
        name,
        _id: decoded.id || _id,
        email: decoded.email,
      });

      console.log("✅ User set in context:", {
        token: !!token,
        role,
        name,
        _id: decoded.id || _id,
        email: decoded.email,
      });

      // Redirect
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Login to UniVerse
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col">
            <span className="text-gray-600 mb-1 font-medium">Email</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-600 mb-1 font-medium">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-md text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
