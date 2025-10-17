import { Link } from "react-router-dom";
import missionImg from "../assets/undraw_young-man-avatar_wgbd.svg";
import teamworkImg from "../assets/undraw_working-together_r43a.svg";
import innovationImg from "../assets/undraw_got-an-idea_1z3i.svg";
import commitmentImg from "../assets/undraw_preparation_59f0.svg";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Hero Section */}
      <section className="py-24 md:py-32 text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-700 mb-4">
          About UniVerse
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          UniVerse is a smart event management and attendance system designed to
          make campus activities seamless for both students and admins. Our
          mission is to simplify event registration, track participation, and
          empower campuses with modern tools.
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-100 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <img
            src={missionImg}
            alt="Mission"
            className="w-64 sm:w-80 md:w-1/3 rounded-xl shadow-md"
          />
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-700">
              Our Mission
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Our mission is to provide a user-friendly platform for managing
              campus events, tracking student participation, and simplifying
              attendance using modern technologies like QR codes. We aim to
              bridge the gap between students and admins for a smoother campus
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-700 mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <img
                src={teamworkImg}
                alt="Teamwork"
                className="mx-auto mb-6 rounded-lg w-36 sm:w-40 h-36 object-contain"
              />
              <h3 className="text-xl font-bold mb-2 text-gray-700">
                Collaboration
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                We believe in teamwork and collaboration to make events more
                effective and engaging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <img
                src={innovationImg}
                alt="Innovation"
                className="mx-auto mb-6 rounded-lg w-36 sm:w-40 h-36 object-contain"
              />
              <h3 className="text-xl font-bold mb-2 text-gray-700">
                Innovation
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                We leverage modern technology like QR attendance to simplify
                campus activities and enhance efficiency.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <img
                src={commitmentImg}
                alt="Commitment"
                className="mx-auto mb-6 rounded-lg w-36 sm:w-40 h-36 object-contain"
              />
              <h3 className="text-xl font-bold mb-2 text-gray-700">
                Commitment
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                We are committed to providing a seamless and enjoyable
                experience for both students and administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center px-6 bg-blue-600 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="mb-6 text-sm sm:text-base">
          Join UniVerse today and simplify your campus event management.
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-transform hover:scale-105"
        >
          Register Now
        </Link>
      </section>
    </div>
  );
}
