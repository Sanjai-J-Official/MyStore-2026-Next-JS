import mongoose from 'mongoose';

/**
 * Converts a product name into a URL-safe slug.
 * e.g. "Running Sneakers!!" → "running-sneakers"
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/-+/g, '-');          // collapse multiple hyphens
}

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this product.'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
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

/**
 * Pre-save hook: auto-generate a unique slug from the product name.
 * - Only runs when slug is missing or name has changed.
 * - Appends a numeric suffix (-1, -2, …) to guarantee uniqueness.
 * - Never touches existing documents that already have a slug.
 *
 * NOTE: async Mongoose hooks do NOT receive a `next` callback —
 * just return early instead of calling next().
 */
ProductSchema.pre('save', async function () {
  // Skip if slug already set AND name hasn't changed
  if (this.slug && !this.isModified('name')) return;

  const base = generateSlug(this.name);
  let slug = base;
  let count = 1;

  // Keep incrementing suffix until we find a slug not already in use
  while (true) {
    const existing = await mongoose.models.Product.findOne({
      slug,
      _id: { $ne: this._id }, // exclude self on updates
    });
    if (!existing) break;
    slug = `${base}-${count++}`;
  }

  this.slug = slug;
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
