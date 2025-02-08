import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Link from '@/lib/models/Link';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const links = await Link.find().populate('category').sort({ createdAt: -1 });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const link = await Link.create(data);
    return NextResponse.json(link);
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const id = request.nextUrl.searchParams.get('id');
    await Link.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}