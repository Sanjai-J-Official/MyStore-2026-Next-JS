import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Link from 'next/link';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

async function getAdminData() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    const products = await Product.find({}).lean();
    return {
      orders: JSON.parse(JSON.stringify(orders)),
      products: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    return { orders: [], products: [] };
  }
}

export default async function AdminDashboard() {
  const { orders, products } = await getAdminData();

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.total, 0);

  const lowStockItems = products.filter((p) => p.stock < 5).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div className={styles.actions}>
          <Link href="/admin/products" className={styles.btnPrimary}>
            Manage Products
          </Link>
          <Link
            href="/admin/products/new"
            className={styles.btnPrimary}
            style={{ background: 'var(--text-primary)' }}
          >
            + Add Product
          </Link>
          <Link
            href="/admin/artisans"
            className={styles.btnPrimary}
            style={{ background: 'var(--primary)' }}
          >
            🗺 Manage Artisans
          </Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Revenue</div>
          <div className={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Orders</div>
          <div className={styles.statValue}>{orders.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Products</div>
          <div className={styles.statValue}>{products.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Low Stock Items</div>
          <div
            className={styles.statValue}
            style={{ color: lowStockItems > 0 ? 'var(--error)' : 'var(--success)' }}
          >
            {lowStockItems}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order._id}>
                  <td style={{ fontWeight: '600' }}>{order.orderId}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div>{order.customer.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {order.customer.email}
                    </div>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{order.total.toLocaleString('en-IN')}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[`status_${order.paymentStatus}`]}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}
                  >
                    No orders found.
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
