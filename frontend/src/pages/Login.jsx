import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Lock, AtSign } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(username, password);
            navigate('/generate');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
            <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent' : ''}`} />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative p-8 rounded-2xl shadow-2xl w-full max-w-md transition-colors duration-300 ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-neutral-200'}`}
            >
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>Welcome Back</h2>
                    <p className={`mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Generate resumes & cover letters in seconds</p>
                </div>

                {error && (
                    <div className="bg-red-950/50 border border-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Username</label>
                        <div className="relative">
                            <AtSign className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`pl-10 ${isDark ? '' : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-500'}`}
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`pl-10 ${isDark ? '' : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-500'}`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className={`w-full h-11 text-base ${isDark ? '' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className={`mt-6 text-center text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Don't have an account?{' '}
                    <Link to="/signup" className={`font-medium underline underline-offset-4 ${isDark ? 'text-white hover:text-neutral-300' : 'text-neutral-900 hover:text-neutral-600'}`}>
                        Sign up
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
