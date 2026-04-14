import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

async function getBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    return [];
  }
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Blogs</h1>
        <div className={styles.actions}>
          <Link href="/admin" className={styles.btnOutline}>
            ← Back to Admin
          </Link>
          <Link href="/admin/blogs/new" className={styles.btnPrimary}>
            + Create New Blog
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title & Slug</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    {blog.featuredImage ? (
                      <div style={{ width: '80px', height: '50px', position: 'relative' }}>
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </div>
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {blog.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      /{blog.slug}
                    </div>
                  </td>
                  <td>{new Date(blog.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link
                        href={`/admin/blogs/${blog._id}`}
                        className={styles.statusBadge}
                        style={{ textDecoration: 'none', background: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className={styles.statusBadge}
                        style={{ textDecoration: 'none', background: 'var(--primary-dark)', color: 'white' }}
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}
                  >
                    No blogs found. Create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
