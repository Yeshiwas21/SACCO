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


  
    

          
              

