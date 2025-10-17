import { useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Instagram } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-24 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 relative overflow-hidden">
        {/* Success Toast */}
        {sent && (
          <div className="absolute top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md animate-bounce">
            ✅ Message sent! We'll get back soon.
          </div>
        )}

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">
          Have questions or feedback? Reach out to us — we’ll respond as soon as
          possible.
        </p>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 bg-white"
          >
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-xl py-3 mt-2 hover:bg-blue-700 transition-all font-semibold shadow-md cursor-pointer"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Our Office
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} /> Delhi, India
              </p>
              <p className="flex items-center gap-2">
                <Mail className="text-blue-600" size={20} />{" "}
                mayankmittal3009@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="text-blue-600" size={20} /> +91 98734 90275
              </p>
            </div>

            <h2 className="text-2xl font-bold text-blue-600 mt-10 mb-3">
              Follow Us
            </h2>
            <div className="flex gap-5 text-gray-600">
              <a
                href="https://github.com/mayank30092"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-transform transform hover:scale-110"
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com/in/mayankmittal30092"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-transform transform hover:scale-110"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://instagram.com/mayank_mittal3/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-transform transform hover:scale-110"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
