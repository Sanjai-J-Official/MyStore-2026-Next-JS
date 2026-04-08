import { NextResponse } from 'next/server';

/**
 * Seed route has been permanently disabled.
 *
 * All product data lives exclusively in MongoDB.
 * Create products via POST /api/products or the admin panel:
 *   /admin/products/new?key=<admin_key>
 *
 * Slugs are auto-generated from the product name by the
 * Mongoose pre-save hook in models/Product.js — you never
 * need to supply a slug manually.
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message:
        'Seed route is disabled. Add products via POST /api/products or the admin panel.',
    },
    { status: 410 } // 410 Gone — intentionally removed
  );
}
