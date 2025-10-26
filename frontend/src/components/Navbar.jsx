import React from 'react'

const Navbar =() => {
  return (
<div className="flex justify-between items-center h-24 text-white px-8 bg-gray-900">
  <h1 className="text-3xl font-bold text-green-400">SACCO.</h1>

  <ul className="flex gap-10">
    <li className="hover:text-green-400 cursor-pointer">Home</li>
    <li className="hover:text-green-400 cursor-pointer">Contact</li>
    <li className="hover:text-green-400 cursor-pointer">About</li>
    <li className="hover:text-green-400 cursor-pointer ml-[150px]">Login</li>
  </ul>
</div>

    
  )
}

export default Navbar

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <a
              href="#"
              className="text-2xl font-bold text-white hover:text-blue-500 transition duration-300"
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
                className="text-white hover:text-blue-500 text-lg font-medium transition duration-300"
              >
                {item}
              </a>
            ))}
          </div>

  
    

          
              
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-2 space-y-1">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="block px-3 py-2 text-white hover:bg-blue-600 rounded-md transition duration-300"
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

