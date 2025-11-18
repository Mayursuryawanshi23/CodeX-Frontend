import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <div className="nav flex px-6 items-center justify-between h-20 bg-gray-900 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-yellow-400 text-3xl font-extrabold pl-20">〽️</span>
          <span className="font-mono tracking-tight text-white text-3xl">s code</span>
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            window.location.reload();
          }}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default Navbar