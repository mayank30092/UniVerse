export default function Footer() {
  return (
    <footer className="w-full bg-blue-600 text-white shadow-inner mt-10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">UniVerse</h2>
          <p className="text-sm leading-6 text-gray-100">
            UniVerse is your one-stop platform for managing and attending
            university events, simplifying attendance tracking and
            participation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", link: "/" },
              { name: "Login", link: "/login" },
              { name: "About Us", link: "/about" },
              { name: "Contact", link: "/contact" },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Resources</h2>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Privacy Policy", link: "#" },
              { name: "Terms of Service", link: "#" },
              { name: "Help Center", link: "#" },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-sm">
            Email:{" "}
            <a
              href="mailto:mayankmittal3009@gmail.com"
              className="hover:underline"
            >
              mayankmittal3009@gmail.com
            </a>
          </p>
          <p className="text-sm">
            Phone:{" "}
            <a href="tel:+919873490275" className="hover:underline">
              +91 9873490275
            </a>
          </p>
          <div className="flex flex-wrap gap-4 mt-3">
            <a
              href="https://github.com/mayank30092"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mayankmittal30092"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors text-sm"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/mayank_mittal3/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors text-sm"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-400 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-center sm:text-left">
          <p>© 2025 UniVerse. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Built with <span className="text-red-400">❤️</span> by{" "}
            <span className="font-medium">Team UniVerse</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
