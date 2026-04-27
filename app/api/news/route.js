import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { title, content, imageUrl, category } = data;

    let createdBy = 'admin';
    const token = req.cookies.get('admin_token')?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.username) {
          createdBy = payload.username;
        }
      } catch (e) {
        console.error('Invalid token during news creation');
      }
    }

    // Generate slug from title
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Ensure slug is unique
    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        slug,
        imageUrl,
        category,
        createdBy,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
