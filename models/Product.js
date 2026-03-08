import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this product.'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price.'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Please provide an original price.'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description.'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL.'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category.'],
      enum: ['Clothing', 'Footwear', 'Electronics', 'Accessories', 'Bags'],
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
