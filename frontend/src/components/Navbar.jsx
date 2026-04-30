import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MdLogout, MdMenu } from 'react-icons/md';

const Navbar = ({ toggleSidebar }) => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-3 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all"
        >
          <MdMenu className="h-7 w-7" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        {/* Search or Quick Action could go here */}
        
        <button
          onClick={logout}
          className="group flex items-center space-x-2 px-5 py-2.5 rounded-xl text-slate-600 hover:text-white hover:bg-red-500 transition-all duration-300 border border-slate-200 hover:border-red-500 shadow-sm"
        >
          <span className="hidden sm:block font-bold tracking-wide">Sign Out</span>
          <MdLogout className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
