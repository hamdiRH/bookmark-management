import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Departement from '@/lib/models/Departement';
import PC from '@/lib/models/PC';

export const dynamic = 'force-dynamic';

// export async function GET() {
//   try {
//     await dbConnect();
//     const departments = await PC.distinct('department');
//     return NextResponse.json(departments.sort());
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const depeartements = await Departement.find({}).sort({ name: 1 });
    return NextResponse.json(depeartements);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// export async function PUT(request: NextRequest) {
//   try {
//     await dbConnect();
//     const { oldName, newName } = await request.json();
//     await PC.updateMany({ department: oldName }, { department: newName });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const departement = await Departement.create(data);
    return NextResponse.json(departement);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const departement = await Departement.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(departement);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const id = request.nextUrl.searchParams.get('id');
    await Departement.findByIdAndDelete(id);
    await PC.deleteMany({ department: id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// export async function DELETE(request: NextRequest) {
//   try {
//     await dbConnect();
//     const name = request.nextUrl.searchParams.get('name');
//     await PC.deleteMany({ department: name });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }