import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Download, 
    ArrowLeft, 
    Sparkles, 
    LogOut, 
    Eye,
    Edit3,
    FileDown,
    Moon,
    Sun
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import ReactMarkdown from 'react-markdown';

export default function Editor() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [content, setContent] = useState(location.state?.content || '');
    const [isDownloading, setIsDownloading] = useState(false);
    const previewRef = useRef(null);

    const isDark = theme === 'dark';

    useEffect(() => {
        if (!location.state?.content) {
            navigate('/generate');
        }
    }, [location.state, navigate]);

    const downloadAsPDF = async () => {
        setIsDownloading(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = previewRef.current;
            
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF generation failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const downloadAsDOCX = async () => {
        setIsDownloading(true);
        try {
            const lines = content.split('\n');
            const children = [];
            
            lines.forEach((line) => {
                if (line.startsWith('# ')) {
                    children.push(
                        new Paragraph({
                            text: line.replace('# ', ''),
                            heading: HeadingLevel.HEADING_1,
                            spacing: { after: 200 }
                        })
                    );
                } else if (line.startsWith('## ')) {
                    children.push(
                        new Paragraph({
                            text: line.replace('## ', ''),
                            heading: HeadingLevel.HEADING_2,
                            spacing: { after: 150 }
                        })
                    );
                } else if (line.startsWith('### ')) {
                    children.push(
                        new Paragraph({
                            text: line.replace('### ', ''),
                            heading: HeadingLevel.HEADING_3,
                            spacing: { after: 100 }
                        })
                    );
                } else if (line.startsWith('- ') || line.startsWith('* ')) {
                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: '• ' + line.replace(/^[-*]\s/, '') })
                            ],
                            spacing: { after: 80 }
                        })
                    );
                } else if (line.startsWith('**') && line.endsWith('**')) {
                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: line.replace(/\*\*/g, ''), bold: true })
                            ],
                            spacing: { after: 100 }
                        })
                    );
                } else if (line.trim() === '') {
                    children.push(new Paragraph({ text: '' }));
                } else {
                    const processedRuns = [];
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    parts.forEach(part => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            processedRuns.push(new TextRun({ text: part.replace(/\*\*/g, ''), bold: true }));
                        } else {
                            processedRuns.push(new TextRun({ text: part }));
                        }
                    });
                    children.push(
                        new Paragraph({
                            children: processedRuns,
                            spacing: { after: 80 }
                        })
                    );
                }
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: children
                }]
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, 'document.docx');
        } catch (error) {
            console.error('DOCX generation failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
            <nav className={`border-b sticky top-0 z-10 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'border-neutral-800 bg-neutral-950/80' : 'border-neutral-200 bg-white/80'}`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => navigate('/generate')}
                                className={isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700' : 'bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300'}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center gap-2">
                                <Sparkles className={`h-6 w-6 ${isDark ? 'text-white' : 'text-neutral-900'}`} />
                                <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>joby.ai</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={downloadAsPDF}
                                disabled={isDownloading}
                                className={isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700' : 'bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300'}
                            >
                                <FileDown className="h-4 w-4 mr-2" />
                                PDF
                            </Button>
                            <Button
                                onClick={downloadAsDOCX}
                                disabled={isDownloading}
                                className={isDark ? '' : 'bg-neutral-900 text-white hover:bg-neutral-800'}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                DOCX
                            </Button>
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900'}`}
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            <span className={`ml-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>@{user?.username}</span>
                            <Button 
                                onClick={logout} 
                                className={isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700' : 'bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300'}
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="h-[calc(100vh-4rem)]">
                <div className="grid grid-cols-2 h-full">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`border-r flex flex-col ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}
                    >
                        <div className={`px-4 py-3 border-b flex items-center gap-2 ${isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'}`}>
                            <Edit3 className={`h-4 w-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Editor</span>
                            <span className={`text-xs ml-auto ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>Markdown supported</span>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`flex-1 w-full p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none transition-colors ${isDark ? 'bg-neutral-950 text-neutral-300' : 'bg-neutral-50 text-neutral-800'}`}
                            placeholder="Edit your document here..."
                            spellCheck="false"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
                    >
                        <div className={`px-4 py-3 border-b flex items-center gap-2 ${isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'}`}>
                            <Eye className={`h-4 w-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Preview</span>
                        </div>
                        <div 
                            ref={previewRef}
                            className="flex-1 p-6 overflow-auto bg-white"
                        >
                            <div className="prose prose-sm max-w-none text-neutral-800">
                                <ReactMarkdown
                                    components={{
                                        h1: ({children}) => <h1 className="text-2xl font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">{children}</h1>,
                                        h2: ({children}) => <h2 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">{children}</h2>,
                                        h3: ({children}) => <h3 className="text-lg font-medium text-neutral-700 mt-4 mb-2">{children}</h3>,
                                        p: ({children}) => <p className="text-neutral-700 mb-3 leading-relaxed">{children}</p>,
                                        ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                                        li: ({children}) => <li className="text-neutral-700">{children}</li>,
                                        strong: ({children}) => <strong className="font-semibold text-neutral-900">{children}</strong>,
                                        hr: () => <hr className="my-4 border-neutral-300" />,
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
