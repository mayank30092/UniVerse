import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      setUser({
        token: res.data.token,
        role: res.data.role,
        name: res.data.name,
      });

      alert("Registration successful and logged in");

      //navigate to dashboard
      navigate(res.data.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full mx-w-lg md:max-w-xl bg-white rounded-3xl shadow-2xl p-10 md:p-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Register for UniVerse
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg "
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            required
          />
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            {/* Custom dropdown arrow */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              ▼
            </span>
          </div>
          <button
            type="submit"
            className="mt-6 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-lg"
          >
            Register
          </button>
        </form>
        <p className="text-md text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
