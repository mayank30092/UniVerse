import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Hero Section */}
      <section className=" h-72 flex flex-col items-center text-center pt-40 px-6 mb-24">
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
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
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
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center flex flex-col items-center">
          <img
            src="/src/assets/undraw_blogging_38kl.svg"
            alt=""
            className="w-32 mr-4 mb-1 h-32"
          />
          <h3 className="text-xl font-bold mb-2">For Students</h3>
          <p className="text-gray-600">
            Browse upcoming events, register in one click, and keep track of
            your participation.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center flex flex-col items-center">
          <img
            src="/src/assets/undraw_designer-avatar_n5q8.svg"
            alt=""
            className="w-32 mr-4"
          />
          <h3 className="text-xl font-bold mb-2">For Admins</h3>
          <p className="text-gray-600">
            Create and manage events, monitor registrations, and handle
            attendance seamlessly.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center flex flex-col items-center">
          <img src="src/assets/qr-code.png" alt="" className="w-32 mr-4 mb-1" />
          <h3 className="text-xl font-bold mb-2">QR Attendance</h3>
          <p className="text-gray-600">
            Quick and secure attendance tracking with QR code scanning.
          </p>
        </div>
      </section>

      {/* Section 1: Students (Image Left, Text Right) */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-100py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20 md:gap-32">
          {/* Image with subtle float animation */}
          <img
            src="/src/assets/undraw_social-notifications_zahe.svg"
            alt="Students"
            className="md:w-1/3 animate-bounce-slow"
          />

          {/* Text container with rounded bg and shadow */}
          <div className="md:w-1/2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              Empowering Students
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Discover new opportunities, join events effortlessly, and showcase
              your participation in one place. UniVerse helps you stay connected
              to your campus life.
            </p>
            <p className="text-gray-600 text-lg font-medium mb-2">
              With UniVerse, you can:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              <li>Explore upcoming events and workshops on campus</li>
              <li>Track your registrations and attendance easily</li>
              <li>Connect with fellow students and build your network</li>
              <li>
                Receive personalized notifications for events that match your
                interests
              </li>
              <li>
                Earn recognition for your active participation and achievements
              </li>
            </ul>
            <p className="mt-4 text-gray-600 text-lg font-semibold">
              Join thousands of students already making the most out of their
              campus experience.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Admins (Text Left, Image Right) */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-100 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20 md:gap-32">
          {/* Text container with card style */}
          <div className="md:w-1/2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              Smarter Tools for Admins
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Manage events from start to finish — create events, track
              participants, and handle attendance with QR codes. Everything in
              one dashboard.
            </p>
            <p className="text-gray-600 text-lg font-medium mb-2">
              With UniVerse Admin Tools, you can:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              <li>Create and schedule events effortlessly</li>
              <li>Monitor student registrations and participation</li>
              <li>Manage attendance with QR code scanning</li>
              <li>Generate reports and analytics for better insights</li>
              <li>Communicate with students via notifications and updates</li>
            </ul>
            <p className="mt-4 text-gray-600 text-lg font-semibold">
              Empower your campus operations and make management seamless.
            </p>
          </div>

          {/* Image with rounded corners, shadow, and optional float animation */}
          <img
            src="/src/assets/undraw_creative-flow_t3kz.svg"
            alt="Admins"
            className="md:w-1/2 rounded-lg shadow-lg animate-bounce-slow"
          />
        </div>
      </section>
    </div>
  );
}
