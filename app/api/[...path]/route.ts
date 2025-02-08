import { NextRequest, NextResponse } from 'next/server';
import { MongoDBStorageProvider } from '@/lib/storage/mongodb-provider';
import { JsonStorageProvider } from '@/lib/storage/json-provider';
import { StorageProvider } from '@/lib/storage/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storageType = searchParams.get('storage') || 'mongodb';
    const provider: StorageProvider = storageType === 'json' 
      ? new JsonStorageProvider()
      : new MongoDBStorageProvider();

    const path = params.path.join('/');
    
    switch (path) {
      case 'links':
        return NextResponse.json(await provider.getLinks());
      case 'pcs':
        return NextResponse.json(await provider.getPCs());
      case 'todos':
        return NextResponse.json(await provider.getTodos());
      case 'categories':
        const type = searchParams.get('type') as any;
        return NextResponse.json(await provider.getCategories(type));
      case 'departments':
        return NextResponse.json(await provider.getDepartments());
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storageType = searchParams.get('storage') || 'mongodb';
    const provider: StorageProvider = storageType === 'json' 
      ? new JsonStorageProvider()
      : new MongoDBStorageProvider();

    const path = params.path.join('/');
    const data = await request.json();
    
    switch (path) {
      case 'links':
        return NextResponse.json(await provider.createLink(data));
      case 'pcs':
        return NextResponse.json(await provider.createPC(data));
      case 'todos':
        return NextResponse.json(await provider.createTodo(data));
      case 'categories':
        return NextResponse.json(await provider.createCategory(data));
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storageType = searchParams.get('storage') || 'mongodb';
    const provider: StorageProvider = storageType === 'json' 
      ? new JsonStorageProvider()
      : new MongoDBStorageProvider();

    const path = params.path.join('/');
    const data = await request.json();
    
    switch (path) {
      case 'categories':
        return NextResponse.json(await provider.updateCategory(data._id, data));
      case 'departments':
        await provider.updateDepartment(data.oldName, data.newName);
        return NextResponse.json({ success: true });
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storageType = searchParams.get('storage') || 'mongodb';
    const provider: StorageProvider = storageType === 'json' 
      ? new JsonStorageProvider()
      : new MongoDBStorageProvider();

    const path = params.path.join('/');
    
    switch (path) {
      case 'categories':
        const id = searchParams.get('id');
        if (!id) throw new Error('ID is required');
        await provider.deleteCategory(id);
        return NextResponse.json({ success: true });
      case 'departments':
        const name = searchParams.get('name');
        if (!name) throw new Error('Name is required');
        await provider.deleteDepartment(name);
        return NextResponse.json({ success: true });
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}