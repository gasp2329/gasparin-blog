"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  ImageIcon,
  LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Start writing your post...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap",
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;

        const file = files[0];
        if (!file.type.startsWith("image/")) return false;

        event.preventDefault();

        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          const { state } = view;
          const pos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos;

          if (pos !== undefined) {
            const node = state.schema.nodes.image.create({ src });
            const tr = state.tr.insert(pos, node);
            view.dispatch(tr);
          }
        };
        reader.readAsDataURL(file);
        return true;
      },
      handlePaste(view, event) {
        const files = event.clipboardData?.files;
        if (!files?.length) return false;

        const file = files[0];
        if (!file.type.startsWith("image/")) return false;

        event.preventDefault();

        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          const node = view.state.schema.nodes.image.create({ src });
          const tr = view.state.tr.replaceSelectionWith(node);
          view.dispatch(tr);
        };
        reader.readAsDataURL(file);
        return true;
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-accent/10 text-accent"
          : "text-muted hover:text-foreground hover:bg-surface-hover"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-surface">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-surface-hover/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton onClick={addImage} title="Insert Image">
          <ImageIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={addLink}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          <LinkIcon size={18} />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={18} />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="px-6 py-4 min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      {/* Drop zone hint */}
      <div className="px-6 py-2 border-t border-border bg-surface-hover/30">
        <p className="text-xs text-muted text-center">
          Drop images anywhere to insert · Paste images from clipboard
        </p>
      </div>
    </div>
  );
}
