import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import styles from './blog.module.css';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export const metadata = {
  title: 'Blog | Hidden Leaf Store',
  description: 'Read the latest updates, stories from our artisans, and tips on handcrafted wood from Hidden Leaf.',
};

async function getBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ visibility: 'published' }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogListPage() {
  const blogs = await getBlogs();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>The Hidden Leaf Journal</h1>
        <p className={styles.subtitle}>
          Discover stories behind our artistry, tips on luxury woodwork, and behind-the-scenes insights.
        </p>
      </header>

      {blogs.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
          No posts available right now.
        </div>
      ) : (
        <div className={styles.grid}>
          {blogs.map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog._id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  className={styles.image}
                />
              </div>
              <div className={styles.content}>
                <div className={styles.date}>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <h2 className={styles.cardTitle}>{blog.title}</h2>
                <p className={styles.introduction}>{blog.introduction}</p>
                <div className={styles.readMore}>Read Article</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
