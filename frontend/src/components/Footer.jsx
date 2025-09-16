export default function Footer() {
  return (
    <footer className="w-full shadow-inner -mt-7 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-600">
        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">UniVerse</h2>
          <p className="text-sm leading-6">
            UniVerse is your one-stop platform for managing and attending
            university events, simplifying attendance tracking and
            participation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-600 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-blue-600 transition">
                Login
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-600 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-600 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Resources
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Contact</h2>
          <p className="text-sm">Email: mayankmittal3009@gmail.com</p>
          <p className="text-sm">Phone: +91 9873490275</p>
          <div className="flex gap-4 mt-3">
            <a
              href="https://github.com/mayank30092"
              target="_blank"
              className="hover:text-blue-600 transition text-sm"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mayankmittal30092"
              target="_blank"
              className="hover:text-blue-600 transition text-sm"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/mayank_mittal3/"
              target="_blank"
              className="hover:text-blue-600 transition text-sm"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 UniVerse. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Built with ❤️ by{" "}
            <span className="font-medium text-gray-700">Team UniVerse</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
