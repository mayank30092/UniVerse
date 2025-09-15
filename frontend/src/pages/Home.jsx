import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      {/* Hero Section */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
        Welcome to UniVerse
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        A smart event management and attendance system designed for students and
        admins. Register for events, track attendance, and simplify your campus
        activities.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mb-12">
        <Link
          to="/login"
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 transition"
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

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        <div className="p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">For Students</h3>
          <p className="text-gray-600">
            Browse upcoming events, register in one click, and keep track of
            your participation.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">For Admins</h3>
          <p className="text-gray-600">
            Create and manage events, monitor registrations, and handle
            attendance seamlessly.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">QR Attendence</h3>
          <p className="text-gray-600">
            Quick and secure attendence tracking with QR code scanning.
          </p>
        </div>
      </div>
    </div>
  );
}
