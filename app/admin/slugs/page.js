import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import SlugClientPage from './SlugClientPage';

export const dynamic = 'force-dynamic';

async function getUrlData() {
  await dbConnect();
  
  // Fetch only needed fields to keep payload light
  const products = await Product.find({}).select('_id name slug').lean();
  const blogs = await Blog.find({}).select('_id title slug').lean();

  const formattedProducts = products.map(p => ({
    id: p._id.toString(),
    title: p.name,
    slug: p.slug,
    type: 'Product',
    path: `/products/${p.slug}`
  }));

  const formattedBlogs = blogs.map(b => ({
    id: b._id.toString(),
    title: b.title,
    slug: b.slug,
    type: 'Blog',
    path: `/blog/${b.slug}`
  }));

  return [...formattedProducts, ...formattedBlogs];
}

export default async function SlugsManager() {
  const data = await getUrlData();
  return <SlugClientPage initialData={data} />;
}
