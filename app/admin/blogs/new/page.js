import Link from 'next/link';
import BlogForm from '@/components/admin/BlogForm';
import styles from '../../admin.module.css';

export default function NewBlogPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Blog</h1>
        <div className={styles.actions}>
          <Link href="/admin/blogs" className={styles.btnOutline}>
            ← Back to Blogs
          </Link>
        </div>
      </div>
      <BlogForm />
    </div>
  );
}
