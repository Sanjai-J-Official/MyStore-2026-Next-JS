import mongoose from 'mongoose';

/**
 * Converts a blog title into a URL-safe slug.
 * e.g. "Amazing New Products!!" → "amazing-new-products"
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this blog.'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    featuredImage: {
      type: String,
      required: [true, 'Please provide a featured image URL.'],
    },
    introduction: {
      type: String,
      required: [true, 'Please provide a short introduction.'],
      maxlength: [300, 'Introduction cannot be more than 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content for the blog.'],
    },
    metaTitle: {
      type: String,
      required: [true, 'Please provide a meta title for SEO.'],
      maxlength: [80, 'Meta title should be concise, ideally under 60-80 chars'],
    },
    metaDescription: {
      type: String,
      required: [true, 'Please provide a meta description for SEO.'],
      maxlength: [160, 'Meta description should ideally be under 160 chars'],
    },
    visibility: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true }
);

BlogSchema.pre('save', async function () {
  // Skip if slug already set AND title hasn't changed
  if (this.slug && !this.isModified('title')) return;

  const base = generateSlug(this.title);
  let slug = base;
  let count = 1;

  while (true) {
    const existing = await mongoose.models.Blog.findOne({
      slug,
      _id: { $ne: this._id }, // exclude self on updates
    });
    if (!existing) break;
    slug = `${base}-${count++}`;
  }

  this.slug = slug;
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
