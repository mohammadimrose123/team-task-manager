import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MdDashboard, MdWork, MdAssignment, MdPeople } from 'react-icons/md';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard className="w-6 h-6" /> },
    { name: 'Projects', path: '/projects', icon: <MdWork className="w-6 h-6" /> },
    { name: 'Tasks', path: '/tasks', icon: <MdAssignment className="w-6 h-6" /> },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Team', path: '/team', icon: <MdPeople className="w-6 h-6" /> });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shadow-2xl lg:shadow-none border-r border-slate-800`}
      >
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50">
          <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-500/20">
            <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TeamTasker
          </h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `group flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <span className="relative z-10 font-semibold tracking-wide">{item.name}</span>
              {/* Subtle hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800/50 backdrop-blur-xl">
          <div className="flex items-center space-x-4 p-2 rounded-2xl bg-slate-900/50 border border-slate-800/50">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
