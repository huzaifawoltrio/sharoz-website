"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  ImageIcon,
} from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary-client";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  folder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  folder = "content",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none min-h-[220px] rounded-b-md border border-t-0 border-stone-300 px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function addLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  }

  async function addImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const { url } = await uploadToCloudinary(file, folder);
      editor?.chain().focus().setImage({ src: url }).run();
    };
    input.click();
  }

  const buttons = [
    {
      icon: Bold,
      label: "Bold",
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      icon: Italic,
      label: "Italic",
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      icon: Heading2,
      label: "Heading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Heading3,
      label: "Subheading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: List,
      label: "Bullet list",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
    {
      icon: Quote,
      label: "Quote",
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
    { icon: LinkIcon, label: "Link", onClick: addLink, active: editor.isActive("link") },
    { icon: ImageIcon, label: "Image", onClick: addImage, active: false },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-md border border-stone-300 bg-stone-50 p-1.5">
        {buttons.map(({ icon: Icon, label, onClick, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            onClick={onClick}
            className={`rounded p-1.5 hover:bg-stone-200 ${
              active ? "bg-stone-200 text-stone-900" : "text-stone-600"
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
