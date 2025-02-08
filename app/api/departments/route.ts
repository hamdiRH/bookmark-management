import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PC from '@/lib/models/PC';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const departments = await PC.distinct('department');
    return NextResponse.json(departments.sort());
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { oldName, newName } = await request.json();
    await PC.updateMany({ department: oldName }, { department: newName });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const name = request.nextUrl.searchParams.get('name');
    await PC.deleteMany({ department: name });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}