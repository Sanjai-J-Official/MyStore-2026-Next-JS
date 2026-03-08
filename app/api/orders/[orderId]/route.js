import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const order = await Order.findOne({ orderId: params.orderId });
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
