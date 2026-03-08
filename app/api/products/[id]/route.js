import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    // Fetch related products (same category, excluding current)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        product,
        relatedProducts
      }
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
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
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
