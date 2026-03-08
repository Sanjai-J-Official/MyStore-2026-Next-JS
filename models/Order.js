import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
      },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['processing', 'shipped', 'delivered'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
