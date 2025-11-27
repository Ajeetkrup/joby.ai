import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import RichTextEditor from '../components/RichTextEditor';
import { motion } from 'framer-motion';
import { 
    Download, 
    ArrowLeft, 
    Sparkles, 
    LogOut, 
    Eye,
    FileDown,
    Moon,
    Sun,
    ChevronRight,
    Menu,
    X,
    Edit3
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export default function Editor() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [content, setContent] = useState(location.state?.content || '');
    const [isDownloading, setIsDownloading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF generation failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const parseHtmlToDocx = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const children = [];

        const processTextNode = (node) => {
            const runs = [];
            
            const extractTextRuns = (element, styles = {}) => {
                if (element.nodeType === Node.TEXT_NODE) {
                    const text = element.textContent;
                    if (text.trim()) {
                        runs.push(new TextRun({
                            text,
                            bold: styles.bold || false,
                            italics: styles.italic || false,
                            underline: styles.underline ? {} : undefined,
                        }));
                    }
                    return;
                }

                const newStyles = { ...styles };
                const tagName = element.tagName?.toLowerCase();

                if (tagName === 'strong' || tagName === 'b') newStyles.bold = true;
                if (tagName === 'em' || tagName === 'i') newStyles.italic = true;
                if (tagName === 'u') newStyles.underline = true;

                for (const child of element.childNodes) {
                    extractTextRuns(child, newStyles);
                }
            };

            extractTextRuns(node);
            return runs;
        };

        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim();
                if (text) {
                    children.push(new Paragraph({
                        children: [new TextRun({ text })],
                        spacing: { after: 80 }
                    }));
                }
                return;
            }

            const tagName = node.tagName?.toLowerCase();

            switch (tagName) {
                case 'h1':
                    children.push(new Paragraph({
                        children: processTextNode(node),
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }));
                    break;
                case 'h2':
                    children.push(new Paragraph({
                        children: processTextNode(node),
                        heading: HeadingLevel.HEADING_2,
                        spacing: { after: 150 }
                    }));
                    break;
                case 'h3':
                    children.push(new Paragraph({
                        children: processTextNode(node),
                        heading: HeadingLevel.HEADING_3,
                        spacing: { after: 100 }
                    }));
                    break;
                case 'p':
                    children.push(new Paragraph({
                        children: processTextNode(node),
                        spacing: { after: 80 }
                    }));
                    break;
                case 'ul':
                    for (const li of node.querySelectorAll(':scope > li')) {
                        children.push(new Paragraph({
                            children: [
                                new TextRun({ text: '• ' }),
                                ...processTextNode(li)
                            ],
                            spacing: { after: 80 }
                        }));
                    }
                    break;
                case 'ol':
                    let index = 1;
                    for (const li of node.querySelectorAll(':scope > li')) {
                        children.push(new Paragraph({
                            children: [
                                new TextRun({ text: `${index}. ` }),
                                ...processTextNode(li)
                            ],
                            spacing: { after: 80 }
                        }));
                        index++;
                    }
                    break;
                case 'br':
                    children.push(new Paragraph({ text: '' }));
                    break;
                default:
                    // Process children for container elements
                    for (const child of node.childNodes) {
                        processNode(child);
                    }
            }
        };

        for (const child of doc.body.childNodes) {
            processNode(child);
        }

        return children;
    };

    const downloadAsDOCX = async () => {
        setIsDownloading(true);
        try {
            const docChildren = parseHtmlToDocx(content);

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: docChildren
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
        <div className={`h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-gradient-to-br from-neutral-50 via-white to-blue-50/30'}`}>
            {isDark && (
                <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/10 to-transparent pointer-events-none" />
            )}
            
            <nav className={`border-b sticky top-0 z-20 backdrop-blur-md transition-colors duration-300 ${isDark ? 'border-neutral-800/50 glass' : 'border-neutral-200/50 bg-white/80'}`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14 sm:h-16 items-center">
                        {/* Mobile: Breadcrumb + Menu */}
                        <div className="flex items-center gap-2 md:hidden">
                            <div className={`p-1.5 rounded-lg gradient-primary`}>
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div className={`flex items-center text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                <span 
                                    onClick={() => navigate('/generate')}
                                    className={`cursor-pointer hover:underline ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}
                                >
                                    Generate
                                </span>
                                <ChevronRight className="h-4 w-4 mx-1" />
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Editor</span>
                            </div>
                        </div>

                        {/* Desktop: Full nav */}
                        <div className="hidden md:flex items-center gap-4">
                            <Button
                                onClick={() => navigate('/generate')}
                                variant={isDark ? "ghost" : "default"}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg gradient-primary`}>
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>joby.ai</span>
                            </div>
                        </div>

                        {/* Mobile: Menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-all ${isDark ? 'bg-neutral-800/50 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'}`}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        {/* Desktop: Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            <Button
                                onClick={downloadAsPDF}
                                disabled={isDownloading}
                                variant={isDark ? "ghost" : "default"}
                            >
                                <FileDown className="h-4 w-4 mr-2" />
                                PDF
                            </Button>
                            <Button
                                onClick={downloadAsDOCX}
                                disabled={isDownloading}
                                variant="primary"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                DOCX
                            </Button>
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-all ${isDark ? 'bg-neutral-800/50 hover:bg-neutral-700 text-neutral-300 hover:text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'}`}
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            <span className={`text-sm ml-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>@{user?.username}</span>
                            <Button 
                                onClick={logout}
                                variant={isDark ? "ghost" : "default"}
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`md:hidden py-4 border-t ${isDark ? 'border-neutral-800/50' : 'border-neutral-200/50'}`}
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => { downloadAsPDF(); setMobileMenuOpen(false); }}
                                        disabled={isDownloading}
                                        variant={isDark ? "ghost" : "default"}
                                        className="flex-1"
                                    >
                                        <FileDown className="h-4 w-4 mr-2" />
                                        PDF
                                    </Button>
                                    <Button
                                        onClick={() => { downloadAsDOCX(); setMobileMenuOpen(false); }}
                                        disabled={isDownloading}
                                        variant="primary"
                                        className="flex-1"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        DOCX
                                    </Button>
                                </div>
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
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </nav>

            <main className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
                <div className="flex flex-col md:grid md:grid-cols-2 h-full overflow-hidden">
                    {/* Editor Panel - 50% height on mobile, 50% width on desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`h-1/2 md:h-full border-b md:border-b-0 md:border-r flex flex-col overflow-hidden shadow-lg ${isDark ? 'border-neutral-800/50 bg-neutral-900/30' : 'border-neutral-200 bg-white'}`}
                    >
                        {/* Mobile Editor Header */}
                        <div className={`md:hidden px-4 h-10 border-b flex items-center gap-2 shrink-0 ${isDark ? 'border-neutral-800/50 bg-neutral-900/50' : 'border-neutral-200 bg-white'}`}>
                            <Edit3 className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Editor</span>
                        </div>
                        <RichTextEditor
                            content={content}
                            onUpdate={setContent}
                            isDark={isDark}
                        />
                    </motion.div>

                    {/* Preview Panel - 50% height on mobile, 50% width on desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`h-1/2 md:h-full flex flex-col overflow-hidden shadow-lg ${isDark ? 'bg-neutral-900/30' : 'bg-white'}`}
                    >
                        <div className={`px-4 h-10 md:h-12 border-b flex items-center gap-2 shrink-0 ${isDark ? 'border-neutral-800/50 bg-neutral-900/50' : 'border-neutral-200 bg-white'}`}>
                            <Eye className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Preview</span>
                        </div>
                        <div 
                            ref={previewRef}
                            className="flex-1 p-4 md:p-8 overflow-auto bg-white shadow-inner"
                        >
                            <div 
                                className="prose prose-sm max-w-none text-neutral-800 
                                    [&_h1]:text-xl [&_h1]:md:text-2xl [&_h1]:font-bold [&_h1]:text-neutral-900 [&_h1]:mb-4 [&_h1]:border-b [&_h1]:border-neutral-200 [&_h1]:pb-2
                                    [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-semibold [&_h2]:text-neutral-800 [&_h2]:mt-6 [&_h2]:mb-3
                                    [&_h3]:text-base [&_h3]:md:text-lg [&_h3]:font-medium [&_h3]:text-neutral-700 [&_h3]:mt-4 [&_h3]:mb-2
                                    [&_p]:text-neutral-700 [&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-sm [&_p]:md:text-base
                                    [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:space-y-1
                                    [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:space-y-1
                                    [&_li]:text-neutral-700 [&_li]:text-sm [&_li]:md:text-base
                                    [&_strong]:font-semibold [&_strong]:text-neutral-900
                                    [&_em]:italic
                                    [&_u]:underline"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
