import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Hero Section */}
      <section className=" h-72 flex flex-col items-center text-center pt-20 px-6 mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to UniVerse
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          A smart event management and attendance system designed for students
          and admins. Register for events, track attendance, and simplify your
          campus activities.
        </p>
        <div className="flex gap-4 mb-12">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Features Section (cards) */}
      <section className=" grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 mb-20 py-12">
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center h-64">
          <h3 className="text-xl font-bold mb-2">For Students</h3>
          <p className="text-gray-600">
            Browse upcoming events, register in one click, and keep track of
            your participation.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-bold mb-2">For Admins</h3>
          <p className="text-gray-600">
            Create and manage events, monitor registrations, and handle
            attendance seamlessly.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-bold mb-2">QR Attendance</h3>
          <p className="text-gray-600">
            Quick and secure attendance tracking with QR code scanning.
          </p>
        </div>
      </section>

      {/* Section 1: Students (Image Left, Text Right) */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-32">
          <img
            src="/src/assets/40-Middle-School-Student-Resize.jpg"
            alt="Students"
            className="rounded-lg shadow-lg md:w-1/3"
          />
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-indigo-700">
              Empowering Students
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover new opportunities, join events effortlessly, and showcase
              your participation in one place. UniVerse helps you stay connected
              to your campus life.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Admins (Text Left, Image Right) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-32">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-indigo-700">
              Smarter Tools for Admins
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Manage events from start to finish — create events, track
              participants, and handle attendance with QR codes. Everything in
              one dashboard.
            </p>
          </div>
          <img
            src="/src/assets/422ea10a-17cb-4555-ba25-cacb4971a33e.jpg"
            alt="Admins"
            className="rounded-lg shadow-lg md:w-1/3"
          />
        </div>
      </section>
    </div>
  );
}
