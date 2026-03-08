import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { amount } = await request.json();
    
    if (!amount) {
      return NextResponse.json({ success: false, error: 'Amount is required' }, { status: 400 });
    }
    
    // Amount in paise
    const options = {
      amount: Math.round(parseFloat(amount) * 100), 
      currency: 'INR',
      receipt: 'rcpt_' + crypto.randomBytes(4).toString('hex')
    };
    
    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });

  } catch (error) {
    console.error('Error creating razorpay order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
