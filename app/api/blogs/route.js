import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET(request) {
  try {
    await connectMongo();
    
    // Support basic pagination/sorting if needed in future, otherwise return all
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectMongo();

    const blog = await Blog.create(data);

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    // Handle Duplicate Key error (slug)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A blog with this slug already exists.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    );
  }
}
