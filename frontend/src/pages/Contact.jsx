import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-20 px-6 mt-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Have questions or feedback? Reach out to us and we'll respond as soon
          as possible.
        </p>

        <div className="md:flex md:gap-12">
          {/* Contact Form */}
          <form className="md:flex-1" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 transition font-medium"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="md:flex-1 mt-10 md:mt-0">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Our Office
            </h2>
            <p className="text-gray-600 mb-2">UniVerse HQ</p>
            <p className="text-gray-600 mb-2">Delhi</p>
            <p className="text-gray-600 mb-2">
              Email: mayankmittal3009@gmail.com
            </p>
            <p className="text-gray-600 mb-2">Phone: +91 98734 90275</p>

            <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-4">
              Follow Us
            </h2>
            <div className="flex gap-4">
              <a
                href="https://github.com/mayank30092"
                target="_blank"
                className="hover:text-blue-600 transition text-sm text-blue-600"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/mayankmittal30092"
                target="_blank"
                className="hover:text-blue-600 transition text-sm text-blue-600"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com/mayank_mittal3/"
                target="_blank"
                className="hover:text-blue-600 transition text-sm text-blue-600"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
