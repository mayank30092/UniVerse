import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register user
      await axios.post("/api/auth/register", { name, email, password, role });

      // Auto-login after registration
      const res = await axios.post("/api/auth/login", { email, password });

      const token = res.data.token;
      const roleResp = res.data.user?.role || res.data.role;
      const nameResp = res.data.user?.name || res.data.name;
      const _id = res.data.user?._id || res.data._id;

      localStorage.setItem("token", token);
      localStorage.setItem("role", roleResp);
      localStorage.setItem("name", nameResp);

      setUser({ token, role: roleResp, name: nameResp, _id });

      alert("Registration successful! Logged in.");

      navigate(roleResp === "admin" ? "/admin" : "/student");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Register for UniVerse
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col">
            <span className="text-gray-600 mb-1 font-medium">Name</span>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              required
            />
          </label>

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

          <label className="flex flex-col relative">
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

          <label className="flex flex-col relative">
            <span className="text-gray-600 mb-1 font-medium">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              ▼
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-md text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
