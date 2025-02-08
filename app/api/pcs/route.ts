import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PC from '@/lib/models/PC';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const pcs = await PC.find().populate('category').sort({ createdAt: -1 });
    return NextResponse.json(pcs);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const pc = await PC.create(data);
    return NextResponse.json(pc);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}