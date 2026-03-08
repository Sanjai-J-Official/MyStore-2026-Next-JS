import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customerDetails,
      cartItems,
      subtotal,
      shipping,
      gst,
      total
    } = body;
    
    // Create signature using crypto
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');
      
    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
    }
    
    // Payment verified, save order to DB
    await dbConnect();
    
    // Generate a human readable order ID
    const orderUniqueId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    
    const newOrder = await Order.create({
      orderId: orderUniqueId,
      customer: customerDetails,
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal,
      shipping,
      gst,
      total,
      paymentId: razorpay_payment_id,
      paymentStatus: 'paid',
      status: 'processing'
    });
    
    return NextResponse.json({ 
      success: true, 
      orderId: newOrder.orderId 
    });

  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process and save order' },
      { status: 500 }
    );
  }
}
