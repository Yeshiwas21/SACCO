import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Updated menu items
  const navLinks = ["About", "Contact", "Login", "Logout"];

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <a
              href="#"
              className="text-2xl font-bold text-white hover:text-green-500 transition duration-300"
            >
              SACCO
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-x-12">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="text-white hover:text-green-500 text-lg font-medium transition duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col justify-center items-center space-y-2.5 w-8 h-10 text-gray-300 hover:text-white focus:outline-none"
            >
              <span
                className={`block h-1 w-full bg-white rounded transition-transform duration-300 ${
                  isOpen ? "rotate-45 translate-y-3" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-full bg-white rounded transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-full bg-white rounded transition-transform duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-3" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-2 space-y-1">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="block px-3 py-2 text-white hover:bg-green-600 rounded-md transition duration-300"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
