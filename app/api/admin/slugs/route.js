import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Blog from '@/models/Blog';

function sanitizeSlug(slug) {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function PUT(request) {
  try {
    const { id, type, slug } = await request.json();
    
    if (!id || !type || !slug) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const cleanSlug = sanitizeSlug(slug);

    if (cleanSlug === '') {
      return NextResponse.json({ success: false, error: 'Slug cannot be empty' }, { status: 400 });
    }

    await dbConnect();
    
    // Choose model
    const Model = type === 'Product' ? Product : Blog;

    // Check for uniqueness
    const existing = await Model.findOne({ slug: cleanSlug, _id: { $ne: id } });
    
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: `A ${type} with the URL "${cleanSlug}" already exists. Slugs must be exactly unique.` 
      }, { status: 400 });
    }

    // Update
    await Model.findByIdAndUpdate(id, { slug: cleanSlug });

    return NextResponse.json({ success: true, newSlug: cleanSlug });
  } catch (error) {
    console.error('Error updating slug:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
