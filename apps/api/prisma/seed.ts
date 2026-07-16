import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { makeExcerpt } from '../src/shared/utils/text.util';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ??
      'postgresql://medium:medium@localhost:5433/medium?schema=public',
  }),
});

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const [ada, linus, grace] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ada@example.com' },
      update: {},
      create: {
        email: 'ada@example.com',
        username: 'ada',
        name: 'Ada Lovelace',
        password,
        bio: 'นักเขียนสายเทคโนโลยี หลงใหลในอัลกอริทึมและบทกวี',
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
      },
    }),
    prisma.user.upsert({
      where: { email: 'linus@example.com' },
      update: {},
      create: {
        email: 'linus@example.com',
        username: 'linus',
        name: 'Linus T.',
        password,
        bio: 'ชอบเรื่อง open source และระบบปฏิบัติการ',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
      },
    }),
    prisma.user.upsert({
      where: { email: 'grace@example.com' },
      update: {},
      create: {
        email: 'grace@example.com',
        username: 'grace',
        name: 'Grace Hopper',
        password,
        bio: 'ผู้บุกเบิกวงการคอมพิวเตอร์ และนักเล่าเรื่อง',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
      },
    }),
  ]);

  const tagDefs = [
    ['Programming', 'programming'],
    ['Web Development', 'web-development'],
    ['Career', 'career'],
    ['Productivity', 'productivity'],
    ['Design', 'design'],
    ['Life', 'life'],
  ];
  await Promise.all(
    tagDefs.map(([name, slug]) =>
      prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } }),
    ),
  );

  const articles: Array<{
    slug: string;
    title: string;
    subtitle: string;
    html: string;
    authorId: string;
    tags: string[];
  }> = [
    {
      slug: 'why-i-still-love-plain-css-abc123',
      title: 'ทำไมผมยังรัก CSS ธรรมดาอยู่',
      subtitle: 'ในวันที่ทุกอย่างมี framework การกลับไปหาพื้นฐานอาจให้อะไรมากกว่าที่คิด',
      html: '<h2>กลับสู่พื้นฐาน</h2><p>CSS สมัยใหม่มีความสามารถมากมาย ทั้ง <strong>grid</strong>, <strong>flexbox</strong> และ custom properties</p><p>บางครั้งเราไม่จำเป็นต้องใช้เครื่องมือหนักๆ เลยด้วยซ้ำ</p><blockquote>เขียนให้น้อย แต่เข้าใจให้มาก</blockquote>',
      authorId: ada.id,
      tags: ['web-development', 'design'],
    },
    {
      slug: 'how-to-read-code-you-didnt-write-def456',
      title: 'วิธีอ่านโค้ดที่คุณไม่ได้เขียนเอง',
      subtitle: 'ทักษะที่สำคัญที่สุดอย่างหนึ่งของ developer',
      html: '<p>การอ่านโค้ดของคนอื่นเป็นทักษะที่ฝึกได้</p><h3>เริ่มจาก entry point</h3><p>ตามหา main หรือ index แล้วไล่ตามการทำงานทีละขั้น</p><ul><li>อ่านชื่อฟังก์ชันก่อน</li><li>ข้าม detail ที่ยังไม่จำเป็น</li><li>วาดแผนภาพเมื่อสับสน</li></ul>',
      authorId: linus.id,
      tags: ['programming', 'career'],
    },
    {
      slug: 'the-art-of-saying-no-ghi789',
      title: 'ศิลปะของการปฏิเสธ',
      subtitle: 'โฟกัสคือการเลือกว่าจะไม่ทำอะไร',
      html: '<p>เวลาของเรามีจำกัด การตอบตกลงกับทุกอย่างหมายถึงการตอบปฏิเสธกับสิ่งที่สำคัญที่สุด</p><p>ลองถามตัวเองว่า <em>ถ้าไม่ใช่ตอนนี้ แล้วเมื่อไหร่</em></p>',
      authorId: grace.id,
      tags: ['productivity', 'life'],
    },
    {
      slug: 'debugging-is-a-superpower-jkl012',
      title: 'การ debug คือพลังพิเศษ',
      subtitle: 'คนที่ debug เก่งคือคนที่เข้าใจระบบอย่างแท้จริง',
      html: '<p>เมื่อโปรแกรมพัง อย่าเดา — ให้พิสูจน์</p><h3>ตั้งสมมติฐานแล้วทดสอบ</h3><p>ลดขอบเขตปัญหาทีละครึ่ง เหมือน binary search</p><pre><code>console.log(state)</code></pre>',
      authorId: ada.id,
      tags: ['programming'],
    },
    {
      slug: 'writing-is-thinking-mno345',
      title: 'การเขียนคือการคิด',
      subtitle: 'ถ้าเขียนออกมาไม่ได้ แปลว่ายังคิดไม่ชัด',
      html: '<p>การเขียนบังคับให้เราจัดระเบียบความคิด</p><p>บทความนี้เกิดจากความยุ่งเหยิงในหัว ที่ค่อยๆ ชัดขึ้นเมื่อพิมพ์ออกมา</p>',
      authorId: grace.id,
      tags: ['life', 'productivity'],
    },
  ];

  for (const a of articles) {
    const excerpt = makeExcerpt(a.html);
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        subtitle: a.subtitle,
        content: a.html,
        excerpt,
        published: true,
        publishedAt: new Date(),
        authorId: a.authorId,
        tags: { connect: a.tags.map((slug) => ({ slug })) },
      },
    });
  }

  // ตัวอย่าง comment + like
  const firstArticle = await prisma.article.findUnique({
    where: { slug: 'how-to-read-code-you-didnt-write-def456' },
  });
  if (firstArticle) {
    const existing = await prisma.comment.count({
      where: { articleId: firstArticle.id },
    });
    if (existing === 0) {
      await prisma.comment.create({
        data: {
          body: 'บทความดีมากครับ ขอบคุณที่แบ่งปัน 🙏',
          articleId: firstArticle.id,
          authorId: ada.id,
        },
      });
    }
    await prisma.like.upsert({
      where: {
        articleId_userId: { articleId: firstArticle.id, userId: ada.id },
      },
      update: {},
      create: { articleId: firstArticle.id, userId: ada.id },
    });
    await prisma.like.upsert({
      where: {
        articleId_userId: { articleId: firstArticle.id, userId: grace.id },
      },
      update: {},
      create: { articleId: firstArticle.id, userId: grace.id },
    });
  }

  console.log('✅ Seed เสร็จแล้ว — login: ada@example.com / password123');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
