'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin-layout.module.css';

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  // If we are on the login page, render just the children without the sidebar shell.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', exact: true },
    { label: 'Products', path: '/admin/products' },
    { label: 'Blogs', path: '/admin/blogs' },
    { label: 'URLs / Slugs', path: '/admin/slugs' },
    { label: 'Categories', path: '/admin/categories' },
    { label: 'Artisans', path: '/admin/artisans' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            Hidden Leaf
          </Link>
          <span className={styles.badge}>Admin Panel</span>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.path 
              : pathname.startsWith(item.path);
              
            return (
              <Link
                key={item.label}
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
