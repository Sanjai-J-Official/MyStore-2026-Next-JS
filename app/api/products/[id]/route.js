import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Try slug first, then fall back to _id (backward compat)
    let product = await Product.findOne({ slug: params.id });
    if (!product) {
      product = await Product.findById(params.id).catch(() => null);
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Related products: same category, excluding current
    const relatedProducts = await Product.find({
      categories: { $in: product.categories || [] },
      _id: { $ne: product._id },
    }).limit(4);

    return NextResponse.json({
      success: true,
      data: { product, relatedProducts },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}


export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();

    // Never let caller override the slug — it's always derived from name
    delete body.slug;

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Assign each field individually so Mongoose tracks changes
    // and the pre-save hook can regenerate the slug if name changed
    Object.assign(product, body);
    await product.save();

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 400 }
    );
  }
}


export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 400 }
    );
  }
}
