import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Check for admin key in production (simplified for this task)
    // In a real app, use proper authentication middleware
    
    const orders = await Order.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
