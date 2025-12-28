import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
const Header = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Welcome, {user?.name}
            </h2>

            <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.is_admin ? 'Admin' : 'Member'}</p>
                    </div>
                </Link>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;