import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MdDashboard, MdWork, MdAssignment, MdPeople } from 'react-icons/md';

const Sidebar = () => {
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
    <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider text-indigo-400">TeamTasker</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
