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
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-transparent' : 'bg-gradient-to-br from-blue-100/20 via-purple-100/10 to-transparent'}`} />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative p-10 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 backdrop-blur-sm ${isDark ? 'bg-neutral-900/80 border border-neutral-800/50' : 'bg-white/90 border border-neutral-200/50'}`}
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Welcome Back</h2>
                    <p className={`text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Generate resumes & cover letters in seconds</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2"
                    >
                        <span className="text-red-500">⚠</span>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className={`text-sm font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Username</label>
                        <div className="relative">
                            <AtSign className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`pl-10 transition-all focus:ring-2 ${isDark ? 'focus:ring-blue-500/50' : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:ring-blue-500/20'}`}
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-sm font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`pl-10 transition-all focus:ring-2 ${isDark ? 'focus:ring-blue-500/50' : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:ring-blue-500/20'}`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        variant="primary"
                        className="w-full h-12 text-base font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white/30 mr-2" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <div className={`mt-8 text-center text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Don't have an account?{' '}
                    <Link to="/signup" className={`font-semibold gradient-text hover:opacity-80 transition-opacity`}>
                        Sign up
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
