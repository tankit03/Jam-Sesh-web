import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import React from 'react'

export default function RichTextEditor({
  value,
  onChange,
  editable = true,
}: {
  value: string,
  onChange: (html: string) => void,
  editable?: boolean,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Helper to check if a mark is active
  const isActive = (type: string) => editor?.isActive(type)

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-2 mb-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded font-bold border border-[#3d00b6] bg-[#1a1333] text-white hover:bg-[#3d00b6]/30 transition-colors ${isActive('bold') ? 'bg-[#3d00b6] text-white' : ''}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded italic border border-[#3d00b6] bg-[#1a1333] text-white hover:bg-[#3d00b6]/30 transition-colors ${isActive('italic') ? 'bg-[#3d00b6] text-white' : ''}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded border border-[#3d00b6] bg-[#1a1333] text-white hover:bg-[#3d00b6]/30 transition-colors ${isActive('bulletList') ? 'bg-[#3d00b6] text-white' : ''}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL')
            if (url) editor?.chain().focus().setLink({ href: url }).run()
          }}
          className={`px-3 py-1 rounded border border-[#3d00b6] bg-[#1a1333] text-white hover:bg-[#3d00b6]/30 transition-colors ${isActive('link') ? 'bg-[#3d00b6] text-white' : ''}`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter image URL')
            if (url) editor?.chain().focus().setImage({ src: url }).run()
          }}
          className="px-3 py-1 rounded border border-[#3d00b6] bg-[#1a1333] text-white hover:bg-[#3d00b6]/30 transition-colors"
        >
          Image
        </button>
      </div>
      <div className="border border-[#3d00b6] rounded bg-[#1a1333] p-3 min-h-[120px] focus-within:ring-2 focus-within:ring-[#3d00b6] transition-all">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
} 