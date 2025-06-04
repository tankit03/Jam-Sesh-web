import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';
import { FaBold, FaItalic, FaStrikethrough, FaListUl, FaListOl, FaImage, FaLink, FaUnlink } from 'react-icons/fa';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const toolbarButton = (active: boolean) =>
  `p-2 rounded-md transition-colors flex items-center justify-center text-base ${
    active
      ? 'bg-[#7F5AF0] text-white shadow-md'
      : 'bg-white/20 text-white hover:bg-[#7F5AF0]/80 hover:text-white'
  }`;

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync with value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-2">
      <div className="mb-2 flex flex-wrap gap-2 items-center bg-white/5 p-2 rounded-lg">
        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={toolbarButton(editor.isActive('bold'))}><FaBold /></button>
        <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={toolbarButton(editor.isActive('italic'))}><FaItalic /></button>
        <button type="button" title="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} className={toolbarButton(editor.isActive('strike'))}><FaStrikethrough /></button>
        <button type="button" title="Bullet List" onClick={() => {
          if (editor.isActive('bulletList')) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleBulletList().run();
          }
        }} className={toolbarButton(editor.isActive('bulletList'))}><FaListUl /></button>
        <button type="button" title="Numbered List" onClick={() => {
          if (editor.isActive('orderedList')) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleOrderedList().run();
          }
        }} className={toolbarButton(editor.isActive('orderedList'))}><FaListOl /></button>
        <button type="button" title="Image" onClick={() => {
          const url = prompt('Enter image URL');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} className={toolbarButton(false)}><FaImage /></button>
        <button type="button" title="Link" onClick={() => {
          const url = prompt('Enter link URL');
          if (url) editor.chain().focus().toggleLink({ href: url }).run();
        }} className={toolbarButton(editor.isActive('link'))}><FaLink /></button>
        <button type="button" title="Unlink" onClick={() => editor.chain().focus().unsetLink().run()} className={toolbarButton(false)}><FaUnlink /></button>
      </div>
      <EditorContent editor={editor} className="bg-white/5 rounded min-h-[120px] p-2 text-white focus:outline-none rich-text-content" />
    </div>
  );
} 