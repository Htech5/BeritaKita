import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const newsId = searchParams.get('newsId');

    if (!newsId) {
      return NextResponse.json({ error: 'newsId is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { newsId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { newsId, userName, commentText } = await req.json();

    const comment = await prisma.comment.create({
      data: {
        newsId,
        userName,
        commentText,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
