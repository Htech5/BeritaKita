import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const news = await prisma.news.update({
      where: { id },
      data: { deletedAt: null },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restore news' }, { status: 500 });
  }
}
