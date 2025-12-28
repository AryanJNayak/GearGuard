import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { ClipboardList, CheckSquare, AlertTriangle } from 'lucide-react'; // Added Icons

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ pending: 0, my_tasks: 0, critical: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/requests/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-8 rounded-2xl shadow-lg text-white">
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                <p className="opacity-90 mt-2 text-lg">
                    Welcome back, {user?.name}. Here is your maintenance summary.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Pending Requests */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Pending Requests</h3>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <ClipboardList size={24} />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-800">
                        {loading ? '-' : stats.pending}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Total active tickets visible to you</p>
                </div>

                {/* Card 2: My Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">My Tasks</h3>
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <CheckSquare size={24} />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-800">
                        {loading ? '-' : stats.my_tasks}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Assigned specifically to you</p>
                </div>

                {/* Card 3: Critical Issues */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Critical Issues</h3>
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-red-600">
                        {loading ? '-' : stats.critical}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">High priority active tickets</p>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;