import React, { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        // ... (Same logic as provided) ...
        e.preventDefault();
        setMsg('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) return setMsg(data.message || 'Login failed');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ id: data.user.id, name: data.user.name, email: data.user.email, is_admin: data.user.role === 'Admin' }));
            setMsg('Login successful');
            window.location.href = '/Welcome';
        } catch (err) {
            setMsg('Error connecting to server');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-slate-400 mt-2">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-300">Password</label>
                                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                            </div>
                            <input
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
                            type="submit"
                        >
                            Sign In
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-sm text-slate-400">
                                Don't have an account?{' '}
                                <a href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </form>

                    {msg && (
                        <div className={`mt-6 p-3 rounded-lg text-center text-sm font-medium ${msg.includes('successful') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {msg}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}