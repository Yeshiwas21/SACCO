import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "#" },
    { label: "Contact", path: "#" },
    { label: "Login", path: "#" },
    { label: "Logout", path: "#" },
    { label: "Main Page", path: "/main" },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <Link
              to="/"
              className="text-3xl font-bold text-gray-800 hover:text-blue-500 transition duration-300"
            >
              SACCO
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-x-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-gray-600 text-xl font-medium px-6 py-3 rounded-md hover:bg-blue-100 hover:text-black transition-all duration-300 inline-block"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col justify-center items-center space-y-2.5 w-8 h-10 text-black focus:outline-none"
            >
              <span
                className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${
                  isOpen ? "rotate-45 translate-y-3" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-full bg-black rounded transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-3" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 py-2 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block px-6 py-3 text-black hover:bg-blue-500 hover:text-white text-xl rounded-md transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
