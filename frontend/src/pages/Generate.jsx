import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Send, Sparkles, LogOut, Copy, Check, Edit3, Moon, Sun } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Generate() {
    const navigate = useNavigate();
    const { user, logout, generate } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [query, setQuery] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const isDark = theme === 'dark';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim() || query.length < 10) {
            setError('Please provide more details (at least 10 characters)');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setOutput('');
        
        try {
            const response = await generate(query);
            setOutput(response.output);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEdit = () => {
        navigate('/editor', { state: { content: output } });
    };

    const examplePrompts = [
        "I need a resume for a Senior Python Developer role. Requirements: 5+ years Python, Django, FastAPI. My details: Name: John Doe, Email: john@example.com, Skills: Python, Django, FastAPI, AWS, Experience: 6 years at Tech Corp, Education: B.Tech in CS",
        "Write a cover letter for a Frontend Engineer position at Google. Requirements: React, TypeScript, 3 years exp. My details: Jane Smith, passionate about UI/UX, expert in React and TypeScript."
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
            <nav className={`border-b sticky top-0 z-10 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'border-neutral-800 bg-neutral-950/80' : 'border-neutral-200 bg-white/80'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <Sparkles className={`h-6 w-6 ${isDark ? 'text-white' : 'text-neutral-900'}`} />
                            <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>joby.ai</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>@{user?.username}</span>
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900'}`}
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            <Button 
                                onClick={logout} 
                                className={isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700' : 'bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300'}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <p className={`text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Create professional resumes & cover letters with AI
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-2xl p-6 mb-6 transition-colors duration-300 ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-neutral-200'}`}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                <FileText className="inline h-4 w-4 mr-2" />
                                Describe what you need
                            </label>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={`w-full h-40 px-4 py-3 rounded-xl resize-none transition-all focus:outline-none focus:ring-2 ${isDark ? 'bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-600 focus:ring-white/20 focus:border-neutral-600' : 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:ring-neutral-900/20 focus:border-neutral-400'}`}
                                placeholder="Example: I need a resume for a Software Engineer role at Google. Requirements: 3+ years experience, Python, JavaScript. My details: Name: John Doe, Email: john@example.com, Phone: 123-456-7890, Skills: Python, JavaScript, React, Node.js, Experience: 4 years at Tech Corp as Full Stack Developer, Education: BS in Computer Science from MIT."
                            />
                        </div>

                        {error && (
                            <div className="bg-red-950/50 border border-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <div className={`text-sm ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>
                                {query.length} characters
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={`px-6 ${isDark ? '' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className={`animate-spin rounded-full h-4 w-4 border-2 border-t-transparent mr-2 ${isDark ? 'border-neutral-900' : 'border-white'}`} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Generate
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {!output && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <p className={`text-sm mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>Try an example:</p>
                        <div className="grid gap-3">
                            {examplePrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => setQuery(prompt)}
                                    className={`text-left p-4 rounded-xl text-sm transition-all ${isDark ? 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-700' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'}`}
                                >
                                    {prompt.substring(0, 120)}...
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {output && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`rounded-2xl p-6 transition-colors duration-300 ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-neutral-200'}`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={`text-lg font-semibold flex items-center ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                    <Sparkles className={`h-5 w-5 mr-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                                    Your Resume / Cover Letter
                                </h2>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCopy}
                                        className={`text-sm ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300'}`}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleEdit}
                                        className={`text-sm ${isDark ? '' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                                    >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit & Download
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-6 overflow-auto max-h-[600px]">
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({children}) => <h1 className="text-2xl font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">{children}</h1>,
                                            h2: ({children}) => <h2 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">{children}</h2>,
                                            h3: ({children}) => <h3 className="text-lg font-medium text-neutral-700 mt-4 mb-2">{children}</h3>,
                                            p: ({children}) => <p className="text-neutral-700 mb-3 leading-relaxed">{children}</p>,
                                            ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 text-neutral-700">{children}</ul>,
                                            ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-neutral-700">{children}</ol>,
                                            li: ({children}) => <li className="text-neutral-700">{children}</li>,
                                            strong: ({children}) => <strong className="font-semibold text-neutral-900">{children}</strong>,
                                            em: ({children}) => <em className="italic text-neutral-600">{children}</em>,
                                            hr: () => <hr className="my-4 border-neutral-300" />,
                                            blockquote: ({children}) => <blockquote className="border-l-4 border-neutral-400 pl-4 italic text-neutral-600 my-4">{children}</blockquote>,
                                            a: ({children, href}) => <a href={href} className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600">{children}</a>,
                                        }}
                                    >
                                        {output}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
