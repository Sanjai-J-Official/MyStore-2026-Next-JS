import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Artisan from '@/models/Artisan';

// GET /api/artisans/by-state/[stateId]
// Returns the first (featured) artisan for a given state, plus total count
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { stateId } = params;
    const artisans = await Artisan.find({ stateId })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    if (!artisans.length) {
      return NextResponse.json({ success: false, error: 'No artisans found for this state' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        featured: JSON.parse(JSON.stringify(artisans[0])),
        total: artisans.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
