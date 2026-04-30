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

  if (loading) return <div>Loading dashboard...</div>;

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
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
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
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(209, 213, 219, 0.6)'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome back, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Tasks</div>
          <div className="text-3xl font-bold text-gray-800">{stats?.totalTasks || 0}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-600">{stats?.completedTasks || 0}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">In Progress</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.inProgressTasks || 0}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Overdue</div>
          <div className="text-3xl font-bold text-red-600">{stats?.overdueTasks || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Status Overview</h2>
          <div className="h-64 flex items-center justify-center">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 w-full text-left">Completion Rate</h2>
          <div className="h-64 w-64">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
