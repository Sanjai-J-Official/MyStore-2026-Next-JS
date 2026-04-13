import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const category = await Category.create({ name: body.name.trim() });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
       return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
