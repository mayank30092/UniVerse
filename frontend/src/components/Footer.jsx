export default function Footer() {
  return (
    <footer className="w-full bg-white shadow-inner mt-16">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-gray-600">
        {/* Left side */}
        <p className="text-sm">© 2025 UniVerse. All rights reserved.</p>

        {/* Right side */}
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-blue-600 transition text-sm">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-600 transition text-sm">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-600 transition text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
