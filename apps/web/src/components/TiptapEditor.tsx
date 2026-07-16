'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Box, Divider, IconButton, Paper, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import TitleIcon from '@mui/icons-material/Title';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';

function ToolbarButton({
  title,
  active,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip title={title}>
      <IconButton
        size="small"
        onClick={onClick}
        color={active ? 'primary' : 'default'}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const addLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('ใส่ URL ของลิงก์', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('ใส่ URL ของรูปภาพ');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        p: 0.5,
        alignItems: 'center',
      }}
    >
      <ToolbarButton
        title="ตัวหนา"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FormatBoldIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="ตัวเอียง"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FormatItalicIcon fontSize="small" />
      </ToolbarButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
      <ToolbarButton
        title="หัวข้อใหญ่"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <TitleIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="หัวข้อรอง"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <TitleIcon fontSize="inherit" />
      </ToolbarButton>
      <ToolbarButton
        title="ยกคำพูด"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <FormatQuoteIcon fontSize="small" />
      </ToolbarButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
      <ToolbarButton
        title="รายการหัวข้อ"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FormatListBulletedIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="รายการตัวเลข"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FormatListNumberedIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="โค้ด"
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <CodeIcon fontSize="small" />
      </ToolbarButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
      <ToolbarButton title="ลิงก์" active={editor.isActive('link')} onClick={addLink}>
        <LinkIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton title="รูปภาพ" onClick={addImage}>
        <ImageIcon fontSize="small" />
      </ToolbarButton>
    </Box>
  );
}

export default function TiptapEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'เล่าเรื่องราวของคุณ…' }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <Paper variant="outlined" className="tiptap-editor">
      {editor && <Toolbar editor={editor} />}
      <Divider />
      <Box sx={{ px: 2, py: 1.5 }}>
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}
