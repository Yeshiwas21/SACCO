import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const rightLinks = [
    { label: "Login", path: "/login" },
    { label: "Sign Up", path: "#" },
    { label: "Main Page", path: "/main" },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section - Logo */}
          <Link
            to="/"
            className="text-3xl font-bold text-gray-800 hover:text-yellow-500 transition duration-300"
          >
            SACCO
          </Link>

          {/* Right Section - Links */}
          <div className="hidden md:flex gap-x-6">
            {rightLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="relative text-gray-700 text-lg font-medium px-4 py-2 rounded-md transition-all duration-300 hover:text-yellow-500 group"
              >
                {item.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col justify-center items-center w-8 h-10 text-black focus:outline-none transition-transform duration-300 hover:scale-110"
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
        <div className="md:hidden bg-white px-4 py-2 space-y-1 shadow-md border-t border-gray-100">
          {rightLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block px-6 py-3 text-gray-800 hover:bg-yellow-400 hover:text-white text-lg rounded-md transition-all duration-300"
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
