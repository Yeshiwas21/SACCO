import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-500 w-full text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6">

        {/* Left Section - Logo & Info */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">The HGY SACCO</h2>
          <p className="text-gray-200 text-sm max-w-xs">
            Empowering communities through financial inclusion and savings growth.  
            Secure, reliable, and transparent SACCO management.
          </p>
        </div>

        {/* Center Section - Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-200">
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
            <br />📞 +251 9000000
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-500 mt-6 pt-4 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} The Lotus SACCO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

