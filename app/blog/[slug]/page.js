import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { notFound } from 'next/navigation';
import styles from '../blog.module.css';

export const revalidate = 60; // ISR for blogs

// Dynamically generate metadata for SEO
export async function generateMetadata({ params }) {
  await dbConnect();
  const blog = await Blog.findOne({ slug: params.slug, visibility: 'published' }).lean();

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: blog.metaTitle || `${blog.title} | Hidden Leaf Journal`,
    description: blog.metaDescription || blog.introduction,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.introduction,
      images: [{ url: blog.featuredImage }],
      type: 'article',
    },
  };
}

// Pre-render pages for known slugs
export async function generateStaticParams() {
  await dbConnect();
  const blogs = await Blog.find({ visibility: 'published' }).select('slug').lean();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({ params }) {
  await dbConnect();
  const blog = await Blog.findOne({ slug: params.slug, visibility: 'published' }).lean();

  if (!blog) {
    notFound();
  }

  return (
    <div className={styles.detailContainer}>
      <Link href="/blog" className={styles.backLink}>
        ← Back to all posts
      </Link>

      <div className={styles.detailImageWrapper}>
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          fill
          className={styles.image} // Reusing image class that fits object-cover
        />
      </div>

      <h1 className={styles.detailTitle}>{blog.title}</h1>
      
      <div className={styles.detailMeta}>
        <span>
          Published on{' '}
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Renders the rich-text backlink content natively. The styles are defined in blog.module.css to look seamless and minimal */}
      <div
        className={styles.richContent}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
