import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Send, Sparkles, LogOut, Copy, Check, Edit3, Moon, Sun, Plus, Menu, X, Home, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { marked } from 'marked';

export default function Generate() {
    const navigate = useNavigate();
    const { user, logout, generate } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [query, setQuery] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            if (response?.output) {
                setOutput(response.output);
            } else {
                setError('No output received. Please try again.');
            }
        } catch (err) {
            const errorMessage = 
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                'Failed to generate. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleEdit = () => {
        // Convert markdown to HTML for the TipTap editor
        const htmlContent = marked(output, { breaks: true });
        navigate('/editor', { state: { content: htmlContent } });
    };

    const handleNewGeneration = () => {
        setOutput('');
        setQuery('');
        setError('');
    };

    const examplePrompts = [
        "I need a resume for a Senior Python Developer role. Requirements: 5+ years Python, Django, FastAPI. My details: Name: John Doe, Email: john@example.com, Skills: Python, Django, FastAPI, AWS, Experience: 6 years at Tech Corp, Education: B.Tech in CS",
        "Write a cover letter for a Frontend Engineer position at Google. Requirements: React, TypeScript, 3 years exp. My details: Jane Smith, passionate about UI/UX, expert in React and TypeScript."
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-gradient-to-br from-neutral-50 via-white to-blue-50/30'}`}>
            {/* Gradient Background Effect */}
            {isDark && (
                <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/10 to-transparent pointer-events-none" />
            )}
            
            <nav className={`border-b sticky top-0 z-20 backdrop-blur-md transition-colors duration-300 ${isDark ? 'border-neutral-800/50 glass' : 'border-neutral-200/50 bg-white/80'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14 sm:h-16 items-center">
                        {/* Mobile: Logo + Breadcrumb */}
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg gradient-primary`}>
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <span className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>joby.ai</span>
                            {/* Mobile Breadcrumb */}
                            <div className={`hidden xs:flex sm:hidden items-center text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                <ChevronRight className="h-4 w-4 mx-1" />
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Generate</span>
                            </div>
                        </div>

                        {/* Mobile: Menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`sm:hidden p-2 rounded-lg transition-all ${isDark ? 'bg-neutral-800/50 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'}`}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        {/* Desktop: Actions */}
                        <div className="hidden sm:flex items-center gap-3">
                            <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>@{user?.username}</span>
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-all ${isDark ? 'bg-neutral-800/50 hover:bg-neutral-700 text-neutral-300 hover:text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'}`}
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            <Button 
                                onClick={logout}
                                variant={isDark ? "ghost" : "default"}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`sm:hidden py-4 border-t ${isDark ? 'border-neutral-800/50' : 'border-neutral-200/50'}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>@{user?.username}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={toggleTheme}
                                        className={`p-2 rounded-lg transition-all ${isDark ? 'bg-neutral-800/50 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'}`}
                                    >
                                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                    </button>
                                    <Button 
                                        onClick={logout}
                                        variant={isDark ? "ghost" : "default"}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 sm:mb-12"
                >
                    <h1 className={`text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        Create <span className="gradient-text">Professional</span> Resumes & Cover Letters
                    </h1>
                    <p className={`text-sm sm:text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Powered by AI to help you land your dream job
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!output && (
                        <motion.div
                            key="prompt-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.1 }}
                            className={`rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 shadow-lg ${isDark ? 'bg-neutral-900/50 border border-neutral-800/50 backdrop-blur-sm' : 'bg-white border border-neutral-200 shadow-xl'}`}
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 sm:mb-6">
                                    <label className={`flex items-center gap-2 text-sm font-semibold mb-2 sm:mb-3 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                        <FileText className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                        Describe what you need
                                    </label>
                                    <textarea
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className={`w-full h-32 sm:h-40 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl resize-none transition-all focus:outline-none focus:ring-2 ${isDark ? 'bg-neutral-800/50 border border-neutral-700/50 text-white placeholder-neutral-500 focus:ring-blue-500/50 focus:border-blue-500/50' : 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:ring-blue-500/20 focus:border-blue-500'}`}
                                        placeholder="Example: I need a resume for a Software Engineer role at Google. Requirements: 3+ years experience, Python, JavaScript..."
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm flex items-center gap-2"
                                    >
                                        <span className="text-red-500">⚠</span>
                                        {error}
                                    </motion.div>
                                )}

                                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
                                    <div className={`text-xs sm:text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                                        {query.length} characters
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isLoading}
                                        className="px-6 sm:px-8 w-full sm:w-auto"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white/30 mr-2" />
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
                    )}
                </AnimatePresence>

                {!output && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 sm:mb-8"
                    >
                        <p className={`text-xs sm:text-sm font-semibold mb-3 sm:mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>Try an example:</p>
                        <div className="grid gap-2 sm:gap-3">
                            {examplePrompts.map((prompt, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setQuery(prompt)}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`text-left p-3 sm:p-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm ${isDark ? 'bg-neutral-900/50 border border-neutral-800/50 text-neutral-400 hover:bg-neutral-800/70 hover:border-blue-500/30 hover:shadow-md' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-blue-200 hover:shadow-md'}`}
                                >
                                    {prompt.substring(0, 80)}...
                                </motion.button>
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
                            className={`rounded-xl sm:rounded-2xl p-4 sm:p-8 transition-all duration-300 shadow-xl ${isDark ? 'bg-neutral-900/50 border border-neutral-800/50 backdrop-blur-sm' : 'bg-white border border-neutral-200'}`}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
                                <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                    <div className="p-1 sm:p-1.5 rounded-lg gradient-primary">
                                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                                    </div>
                                    Your Resume / Cover Letter
                                </h2>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button
                                        onClick={handleNewGeneration}
                                        variant={isDark ? "ghost" : "default"}
                                        className="text-xs sm:text-sm flex-1 sm:flex-none"
                                    >
                                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        <span className="hidden xs:inline">New</span>
                                    </Button>
                                    <Button
                                        onClick={handleCopy}
                                        variant={isDark ? "ghost" : "default"}
                                        className="text-xs sm:text-sm flex-1 sm:flex-none"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                                                <span className="hidden xs:inline">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                <span className="hidden xs:inline">Copy</span>
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleEdit}
                                        variant="primary"
                                        className="text-xs sm:text-sm flex-1 sm:flex-none"
                                    >
                                        <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        <span className="hidden xs:inline">Edit &</span> Download
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 sm:p-8 overflow-auto max-h-[400px] sm:max-h-[600px] shadow-inner border border-neutral-100">
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            h1: ({children}) => <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">{children}</h1>,
                                            h2: ({children}) => <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 mt-6 mb-3">{children}</h2>,
                                            h3: ({children}) => <h3 className="text-base sm:text-lg font-medium text-neutral-700 mt-4 mb-2">{children}</h3>,
                                            p: ({children}) => <p className="text-sm sm:text-base text-neutral-700 mb-3 leading-relaxed">{children}</p>,
                                            ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 text-neutral-700 text-sm sm:text-base">{children}</ul>,
                                            ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-neutral-700 text-sm sm:text-base">{children}</ol>,
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
