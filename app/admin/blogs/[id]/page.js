import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogForm from '@/components/admin/BlogForm';
import { notFound } from 'next/navigation';
import styles from '../../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }) {
  await dbConnect();
  
  const blogId = params.id;
  const blog = await Blog.findById(blogId).lean();

  if (!blog) {
    notFound();
  }

  // Convert Object ID to string and parse JSON to pass successfully to Client Component
  const initialData = JSON.parse(JSON.stringify(blog));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Blog Post</h1>
        <div className={styles.actions}>
          <Link href="/admin/blogs" className={styles.btnOutline}>
            ← Back to Blogs
          </Link>
        </div>
      </div>
      <BlogForm initialData={initialData} />
    </div>
  );
}
