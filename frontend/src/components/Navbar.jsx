import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MdLogout, MdMenu } from 'react-icons/md';

const Navbar = ({ toggleSidebar }) => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <MdMenu className="h-6 w-6" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors"
        >
          <span className="hidden sm:block font-medium">Logout</span>
          <MdLogout className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
