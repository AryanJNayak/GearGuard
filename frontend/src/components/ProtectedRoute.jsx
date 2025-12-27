import React from "react";
import { Link } from "react-router-dom";

export default function ProtectedRoute({ children, requiredAdmin = false }) {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token) {
        return (
            <div className="card">
                Please{" "}
                <Link to="/login" className="text-indigo-300">
                    login
                </Link>{" "}
                to access this page
            </div>
        );
    }

    if (requiredAdmin) {
        if (!userStr) return <div className="card">Unauthorized</div>;

        const user = JSON.parse(userStr);
        if (!user.is_admin) {
            return <div className="card">Admin access required</div>;
        }
    }

    return children;
}
