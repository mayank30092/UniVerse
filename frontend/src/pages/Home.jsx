import { Link } from "react-router-dom";
import StudentImg from "../assets/undraw_social-notifications_zahe.svg";
import AdminImg from "../assets/undraw_creative-flow_t3kz.svg";
import Feature1 from "../assets/undraw_blogging_38kl.svg";
import Feature2 from "../assets/undraw_designer-avatar_n5q8.svg";
import Feature3 from "../assets/qr-code.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Hero Section */}
      <section className="h-auto sm:h-72 flex flex-col items-center text-center pt-24 sm:pt-32 px-6 mb-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to UniVerse
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl">
          A smart event management and attendance system for students and
          admins. Register for events, track attendance, and simplify your
          campus activities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
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

      {/* Features Section */}
      <section className="grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 mb-20 py-12">
        {[
          {
            img: Feature1,
            title: "For Students",
            desc: "Browse upcoming events, register in one click, and keep track of your participation.",
          },
          {
            img: Feature2,
            title: "For Admins",
            desc: "Create and manage events, monitor registrations, and handle attendance seamlessly.",
          },
          {
            img: Feature3,
            title: "QR Attendance",
            desc: "Quick and secure attendance tracking with QR code scanning.",
          },
        ].map((f, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl shadow-lg text-center flex flex-col items-center"
          >
            <img src={f.img} alt={f.title} className="w-32 h-32 mb-4" />
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Students Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <img
            src={StudentImg}
            alt="Students"
            className="md:w-1/3 mb-8 md:mb-0"
          />
          <div className="md:w-2/3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              Empowering Students
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Discover new opportunities, join events effortlessly, and showcase
              your participation.
            </p>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              <li>Explore upcoming events and workshops on campus</li>
              <li>Track registrations and attendance easily</li>
              <li>Connect with fellow students</li>
              <li>Receive personalized notifications for events</li>
              <li>Earn recognition for active participation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="md:w-2/3 bg-white rounded-2xl shadow-xl p-8 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              Smarter Tools for Admins
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Manage events from start to finish: create events, track
              participants, and handle attendance with QR codes.
            </p>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              <li>Create and schedule events effortlessly</li>
              <li>Monitor registrations and participation</li>
              <li>Manage attendance with QR code scanning</li>
              <li>Generate reports and analytics</li>
              <li>Communicate with students via notifications</li>
            </ul>
          </div>
          <img
            src={AdminImg}
            alt="Admins"
            className="md:w-1/3 rounded-lg shadow-lg"
          />
        </div>
      </section>
    </div>
  );
}
