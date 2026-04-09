import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Artisan from '@/models/Artisan';

// GET /api/artisans/[id]
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const artisan = await Artisan.findById(params.id).lean();
    if (!artisan) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: artisan });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/artisans/[id]
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const artisan = await Artisan.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!artisan) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: artisan });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE /api/artisans/[id]
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const artisan = await Artisan.findByIdAndDelete(params.id);
    if (!artisan) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
