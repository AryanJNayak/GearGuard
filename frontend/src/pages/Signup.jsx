import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Shield } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Call the signup function from context
        const result = await signup(formData.name, formData.email, formData.password);

        if (result.success) {
            navigate('/login'); // Auto-login and redirect on success
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">

                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                        <Shield size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Create an Account</h2>
                    <p className="text-slate-500 text-sm mt-1">Join GearGuard Maintenance System</p>
                </div>

                {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full py-2 pl-10 pr-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full py-2 pl-10 pr-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full py-2 pl-10 pr-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                className="w-full py-2 pl-10 pr-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;