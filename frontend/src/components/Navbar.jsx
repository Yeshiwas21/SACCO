import React from 'react'

const Navbar = () => {
  return (
    <div>
 <ul className="flex space-x-12 text-lg font-medium">
    <li><a href="#" className="mr-10px hover:text-green-700 font-medium  text-white">Dashboard</a></li>
    <li><a href="#" className="hover:text-green-700 font-medium text-white">Members</a></li>
    <li><a href="#" className="hover:text-green-700 font-medium text-white">Loans</a></li>
    <li><a href="#" className="hover:text-green-700 font-medium text-white">Reports</a></li>
  </ul>
    </div>
  )
}

export default Navbar
