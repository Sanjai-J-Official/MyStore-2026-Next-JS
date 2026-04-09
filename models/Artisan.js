import mongoose from 'mongoose';

const ArtisanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Artisan name is required.'],
      trim: true,
      maxlength: 80,
    },
    stateId: {
      type: String,
      required: [true, 'State ID is required.'],
      lowercase: true,
      trim: true,
    },
    stateLabel: {
      type: String,
      required: [true, 'State label is required.'],
      trim: true,
    },
    product: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
    },
    craft: {
      type: String,
      required: [true, 'Craft name is required.'],
      trim: true,
    },
    region: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: 0,
    },
    image: {
      type: String,
      default: '/icons/cat-artisan-collection.png',
    },
    description: {
      type: String,
      default: '',
      maxlength: 600,
    },
    since: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for fast state-based queries
ArtisanSchema.index({ stateId: 1, featured: -1 });

export default mongoose.models.Artisan ||
  mongoose.model('Artisan', ArtisanSchema);
