import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Hero Section */}
      <section className="py-32 text-center px-6">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          About UniVerse
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          UniVerse is a smart event management and attendance system designed to
          make campus activities seamless for both students and admins. Our
          mission is to simplify event registration, track participation, and
          empower campuses with modern tools.
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <img
            src="/src/assets/mission.jpg"
            alt="Mission"
            className="rounded-lg shadow-lg md:w-1/3"
          />
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-indigo-700">Our Mission</h2>
            <p className="mt-4 text-gray-600">
              Our mission is to provide a user-friendly platform for managing
              campus events, tracking student participation, and simplifying
              attendance using modern technologies like QR codes. We aim to
              bridge the gap between students and admins for a smoother campus
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* Team / Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <img
                src="/src/assets/teamwork.jpg"
                alt="Teamwork"
                className="mx-auto mb-4 rounded-lg"
              />
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-gray-600">
                We believe in teamwork and collaboration to make events more
                effective and engaging.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <img
                src="/src/assets/innovation.jpg"
                alt="Innovation"
                className="mx-auto mb-4 rounded-lg"
              />
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We leverage modern technology like QR attendance to simplify
                campus activities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <img
                src="/src/assets/commitment.jpg"
                alt="Commitment"
                className="mx-auto mb-4 rounded-lg"
              />
              <h3 className="text-xl font-bold mb-2">Commitment</h3>
              <p className="text-gray-600">
                We are committed to providing a seamless and enjoyable
                experience for both students and admins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center px-6 bg-indigo-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">
          Join UniVerse today and simplify your campus event management.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition"
        >
          Register Now
        </Link>
      </section>
    </div>
  );
}
