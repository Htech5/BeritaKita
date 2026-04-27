import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: 'admin123',
      },
    });

    await prisma.admin.upsert({
      where: { username: 'admin2' },
      update: {},
      create: {
        username: 'admin2',
        password: 'admin123',
      },
    });

    return NextResponse.json({ success: true, message: 'Admins seeded successfully' });
  } catch (error) {
    console.error('Error seeding admins:', error);
    return NextResponse.json({ error: 'Failed to seed admins' }, { status: 500 });
  }
}
