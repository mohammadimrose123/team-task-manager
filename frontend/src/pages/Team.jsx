import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MdPeople, MdMail, MdAdminPanelSettings, MdPerson } from 'react-icons/md';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading team members...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <MdPeople />
          <span>{users.length} Members</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((member) => (
          <div key={member._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {member.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <div className="flex items-center text-sm text-gray-500 space-x-1">
                  <MdMail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {member.role === 'Admin' ? <MdAdminPanelSettings /> : <MdPerson />}
                <span>{member.role}</span>
              </div>
              <div className="text-xs text-gray-400">
                Joined {new Date(member.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
