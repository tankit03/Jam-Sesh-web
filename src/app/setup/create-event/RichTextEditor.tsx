import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect, useRef } from 'react';
import { FaBold, FaItalic, FaStrikethrough, FaListUl, FaListOl, FaImage, FaLink } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

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

  // File input ref for image upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep editor content in sync with value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return;
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;
    const { data, error } = await supabase.storage.from('post-media').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      alert('Image upload failed.');
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('post-media').getPublicUrl(filePath);
    if (publicUrlData?.publicUrl) {
      editor?.chain().focus().setImage({ src: publicUrlData.publicUrl }).run();
    } else {
      alert('Failed to get image URL.');
    }
  };

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div className="relative group">
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
        <button type="button" title="Add Image" onClick={() => fileInputRef.current?.click()} className={toolbarButton(false)}><FaImage /></button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <button type="button" title="Add Link" onClick={() => {
          const url = prompt('Enter link URL');
          if (!url) return;
          if (editor.state.selection.empty) {
            // No text selected, insert the URL as text and link
            editor.chain().focus().insertContent(`<a href='${url}' target='_blank' rel='noopener noreferrer'>${url}</a>`).run();
          } else {
            // Text selected, apply link
            editor.chain().focus().toggleLink({ href: url }).run();
          }
        }} className={toolbarButton(editor.isActive('link'))}><FaLink /></button>
      </div>
      <div className="transition-all rounded border border-white/10 bg-white/20 min-h-[120px] w-full p-2 text-white focus-within:border-[#7F5AF0] focus-within:ring-2 focus-within:ring-[#7F5AF0]/40">
        <EditorContent editor={editor} className="bg-transparent w-full h-full outline-none rich-text-content" />
      </div>
    </div>
  );
} 