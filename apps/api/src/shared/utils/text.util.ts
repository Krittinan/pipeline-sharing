import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'h1', 'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol', 'li',
  'a', 'img', 'code', 'pre', 'hr', 'span',
];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'title', 'class'];

// ลิงก์ที่เปิดแท็บใหม่ต้องมี rel="noopener noreferrer" เสมอ (กัน reverse tabnabbing)
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName === 'A' && node.getAttribute('target')) {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/** ทำความสะอาด HTML จาก editor เพื่อกัน XSS ก่อนเก็บลง DB */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

/** ตัด tag ออกให้เหลือ plain text */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** สร้าง excerpt สั้นๆ จากเนื้อหา HTML */
export function makeExcerpt(html: string, max = 200): string {
  const text = stripHtml(html);
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

/** แปลงข้อความเป็น slug (รองรับ unicode/ไทย) */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'article';
}

/** สุ่มท้าย slug กันชนกัน */
export function randomSuffix(len = 6): string {
  return Math.random().toString(36).slice(2, 2 + len);
}
