import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="text-xl font-bold text-indigo-600">MyApp</div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">Welcome, {user?.full_name || user?.email}</span>
                            <Button onClick={logout} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow p-6"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
                    <p className="text-gray-600">
                        You have successfully authenticated! This is a protected route.
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
