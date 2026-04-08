import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

/**
 * ONE-TIME CLEANUP — DELETE /api/clear-products
 *
 * Deletes ALL products from MongoDB so you can start fresh.
 * Run once, then delete this file.
 */
export async function DELETE() {
  try {
    await dbConnect();
    const result = await Product.deleteMany({});
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} product(s). Collection is now empty.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear products' },
      { status: 500 }
    );
  }
}
