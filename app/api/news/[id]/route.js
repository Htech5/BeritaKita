import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Check if it's a soft delete request
    if (body.action === 'trash') {
      const news = await prisma.news.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return NextResponse.json(news);
    }

    // Normal update
    const news = await prisma.news.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.news.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
