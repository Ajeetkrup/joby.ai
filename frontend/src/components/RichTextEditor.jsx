import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, Heading1, Heading2, Heading3 } from 'lucide-react';

const MenuButton = ({ onClick, isActive, disabled, children, title, isDark }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-all ${
            isActive
                ? isDark
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-blue-100 text-blue-600 border border-blue-200'
                : isDark
                    ? 'hover:bg-neutral-800/50 text-neutral-400 hover:text-white border border-transparent'
                    : 'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-transparent'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

const Toolbar = ({ editor, isDark }) => {
    if (!editor) return null;

    return (
        <div className="flex items-center gap-1">
            <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                isDark={isDark}
                title="Bold (Ctrl+B)"
            >
                <Bold className="h-4 w-4" />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                isDark={isDark}
                title="Italic (Ctrl+I)"
            >
                <Italic className="h-4 w-4" />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                isDark={isDark}
                title="Underline (Ctrl+U)"
            >
                <UnderlineIcon className="h-4 w-4" />
            </MenuButton>
            
            <div className={`w-px h-4 mx-1 ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
            
            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                isDark={isDark}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                isDark={isDark}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                isDark={isDark}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </MenuButton>
            
            <div className={`w-px h-4 mx-1 ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
            
            <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                isDark={isDark}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </MenuButton>
        </div>
    );
};

export default function RichTextEditor({ content, onUpdate, isDark }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose prose-sm max-w-none focus:outline-none min-h-full p-6 ${
                    isDark 
                        ? 'prose-invert text-neutral-300' 
                        : 'text-neutral-800'
                }`,
            },
        },
    });

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className={`px-4 h-12 border-b flex items-center gap-2 shrink-0 ${
                isDark ? 'border-neutral-800/50 bg-neutral-900/50' : 'border-neutral-200 bg-white'
            }`}>
                <Toolbar editor={editor} isDark={isDark} />
            </div>
            <div className={`flex-1 overflow-auto ${
                isDark ? 'bg-neutral-950' : 'bg-neutral-50'
            }`}>
                <EditorContent 
                    editor={editor} 
                    className="h-full"
                />
            </div>
        </div>
    );
}

