import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About us" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-blue-600/95 backdrop-blur-md shadow-xl">
      <nav className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex justify-between items-center text-white">
        {/* Brand */}
        <NavLink
          to="/"
          className="text-3xl font-bold tracking-wide"
          onClick={() => setMenuOpen(false)}
        >
          Uni<i>Verse</i>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `font-medium transition hover:text-gray-200 ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {user?.role === "student" && (
            <NavLink
              to="/student"
              className={({ isActive }) =>
                `font-medium transition hover:text-gray-200 ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              Student Dashboard
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `font-medium transition hover:text-gray-200 ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              Admin Dashboard
            </NavLink>
          )}

          {!user ? (
            <NavLink
              to="/login"
              className="border border-white px-4 py-2 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-100 transition"
            >
              Log in
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 font-medium px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              Log out
            </button>
          )}
        </div>

        {/* Small Screen Dropdown Toggle */}
        <button
          className="md:hidden border border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>

      {/* Dropdown Menu for Small Screens */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 text-white px-6 pb-4 flex flex-col gap-3 animate-fadeIn">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block font-medium py-1 transition hover:text-gray-300 ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {user?.role === "student" && (
            <NavLink
              to="/student"
              onClick={() => setMenuOpen(false)}
              className="block font-medium py-1 hover:text-gray-300"
            >
              Student Dashboard
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block font-medium py-1 hover:text-gray-300"
            >
              Admin Dashboard
            </NavLink>
          )}

          {!user ? (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block mt-2 border border-white bg-white text-blue-600 font-semibold rounded-2xl px-4 py-2 text-center hover:bg-gray-100 transition"
            >
              Log in
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="block mt-2 bg-white text-blue-600 font-semibold rounded-2xl px-4 py-2 hover:bg-gray-100 transition"
            >
              Log out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
