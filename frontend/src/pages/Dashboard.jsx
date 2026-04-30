import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { SocketContext } from '../context/SocketContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { MdAssignment } from 'react-icons/md';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    if (socket) {
      socket.on('task_created', fetchStats);
      socket.on('task_updated', fetchStats);
      socket.on('task_deleted', fetchStats);
    }

    return () => {
      if (socket) {
        socket.off('task_created', fetchStats);
        socket.off('task_updated', fetchStats);
        socket.off('task_deleted', fetchStats);
      }
    };
  }, [socket]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  const barData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    datasets: [
      {
        label: 'Tasks',
        data: [
          stats?.completedTasks || 0,
          stats?.inProgressTasks || 0,
          stats?.pendingTasks || 0,
          stats?.overdueTasks || 0,
        ],
        backgroundColor: [
          '#22c55e',
          '#3b82f6',
          '#eab308',
          '#ef4444',
        ],
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [
          stats?.completedTasks || 0,
          (stats?.totalTasks || 0) - (stats?.completedTasks || 0),
        ],
        backgroundColor: ['#6366f1', '#e2e8f0'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-indigo-600">{user?.name}</span>!
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span>LIVE UPDATES ENABLED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: stats?.totalTasks || 0, color: 'indigo', icon: <MdAssignment /> },
          { label: 'Completed', value: stats?.completedTasks || 0, color: 'green', icon: <MdAssignment /> },
          { label: 'In Progress', value: stats?.inProgressTasks || 0, color: 'blue', icon: <MdAssignment /> },
          { label: 'Overdue', value: stats?.overdueTasks || 0, color: 'red', icon: <MdAssignment /> },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">{item.label}</div>
            <div className={`text-4xl font-black text-slate-900 mt-1`}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Task Overview</h2>
            <select className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 px-4 py-2 focus:ring-2 focus:ring-indigo-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <Bar 
              data={barData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  y: { grid: { display: false }, border: { display: false } },
                  x: { grid: { display: false }, border: { display: false } }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0 opacity-50" />
          <h2 className="text-xl font-bold text-slate-900 mb-8 w-full text-left relative z-10">Completion</h2>
          <div className="h-64 w-64 relative z-10">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">
                {stats?.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
