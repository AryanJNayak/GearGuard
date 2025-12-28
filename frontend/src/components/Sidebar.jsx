import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, Wrench, FileText, Settings, Shield } from 'lucide-react';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Helper to highlight active link
    const isActive = (path) => location.pathname === path
        ? "bg-blue-700 text-white"
        : "text-blue-100 hover:bg-blue-600";

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive(to)}`}>
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );

    return (
        <aside className="w-64 bg-blue-800 text-white min-h-screen flex flex-col">
            <div className="p-6 border-b border-blue-700">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield /> GearGuard
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/requests" icon={FileText} label="Maintenance Requests" />
                <NavItem to="/equipment" icon={Wrench} label="Equipment Assets" />

                {/* ADMIN ONLY LINKS */}
                {user?.is_admin && (
                    <>
                        <div className="pt-4 pb-2 text-xs font-semibold text-blue-300 uppercase">Admin Controls</div>
                        <NavItem to="/teams" icon={Users} label="Manage Teams" />
                        <NavItem to="/categories" icon={Settings} label="Categories" />
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-blue-700 text-sm text-blue-300">
                v1.0.0 Stable
            </div>
        </aside>
    );
};

export default Sidebar;