import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 w-full text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">

        {/* Left Section - SACCO info with shift */}
        <div className="text-center md:text-left">
          {/* Inner wrapper to create a left gap */}
          <div className="pl-6 md:pl-10">
            <h2 className="text-2xl font-bold mb-2">The HGY SACCO</h2>
            <p className="text-gray-300 text-sm max-w-xs text-justify">
              Empowering communities through financial inclusion and savings. Secure, reliable, and transparent SACCO management.
            </p>
          </div>
        </div>

        {/* Center Section - Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-base text-gray-200">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
            <li><a href="/support" className="hover:text-white">Support</a></li>
          </ul>
        </div>

        {/* Right Section - Social & Contact */}
        <div className="text-center md:text-right">
          <h3 className="text-lg font-semibold mb-3">Connect with Us</h3>
          <div className="flex justify-center md:justify-end gap-4 mb-2">
            <a href="#" className="hover:text-gray-300"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-gray-300"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-gray-300"><FaLinkedin size={20} /></a>
            <a href="#" className="hover:text-gray-300"><FaInstagram size={20} /></a>
          </div>
          <p className="text-gray-300 text-sm">
            📧 info@hgysacco.com
            <br />
            📞 +251 9000000
          </p>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-500 mt-6 pt-4 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} The HGY SACCO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
