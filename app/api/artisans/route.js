import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Artisan from '@/models/Artisan';

// GET /api/artisans — list all artisans (optional ?state= filter)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const query = state ? { stateId: state } : {};
    const artisans = await Artisan.find(query).sort({ featured: -1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(artisans)) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/artisans — create artisan
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const artisan = await Artisan.create(body);
    return NextResponse.json({ success: true, data: artisan }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
