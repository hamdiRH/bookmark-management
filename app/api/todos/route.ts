import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/lib/models/Todo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const todos = await Todo.find().sort({ createdAt: -1 });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const todo = await Todo.create(data);
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}