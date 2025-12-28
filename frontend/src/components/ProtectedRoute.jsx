import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="p-10">Loading...</div>;

    // 1. Not Logged In? -> Go to Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Admin Route but User is not Admin? -> Go to Dashboard
    if (adminOnly && !user.is_admin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;