import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PC from '@/lib/models/PC';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const pcs = await PC.find().populate('department').sort({ createdAt: -1 });
    return NextResponse.json(pcs);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    console.log("data",data)
    const pc = await PC.create(data);
    return NextResponse.json(pc);
  } catch (error) {
    console.log("error",error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const id = request.nextUrl.searchParams.get('id');
    await PC.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const link = await PC.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(link);
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}