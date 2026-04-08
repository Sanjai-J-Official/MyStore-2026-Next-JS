import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

/**
 * ONE-TIME MIGRATION — GET /api/migrate-slugs
 *
 * Finds every product that has no slug and generates one from its name.
 * Uses the Mongoose pre-save hook in models/Product.js so the same
 * slug logic (lowercase, hyphens, unique suffix) is applied consistently.
 *
 * Safe to run multiple times — skips products that already have a slug.
 * DELETE this route after running it once in production.
 */
export async function GET() {
  try {
    await dbConnect();

    // Find only products missing a slug
    const products = await Product.find({
      $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
    });

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All products already have a slug. Nothing to migrate.',
        migrated: 0,
      });
    }

    const results = [];

    for (const product of products) {
      // Clear slug so the pre-save hook always regenerates it
      product.slug = undefined;
      await product.save(); // pre-save hook fires here

      results.push({ id: product._id, name: product.name, slug: product.slug });
    }

    return NextResponse.json({
      success: true,
      message: `Slugs generated for ${results.length} product(s).`,
      migrated: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}
