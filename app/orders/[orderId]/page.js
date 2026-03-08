import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import styles from './order.module.css';

async function getOrder(orderId) {
  try {
    await dbConnect();
    const order = await Order.findOne({ orderId }).lean();
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    return null;
  }
}

export default async function OrderConfirmationPage({ params }) {
  const order = await getOrder(params.orderId);

  if (!order) {
    return (
      <div className={styles.container} style={{ textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p>The order you are looking for does not exist or may have been deleted.</p>
        <Link href="/" className={styles.btnPrimary} style={{ marginTop: '24px' }}>
          Return Home
        </Link>
      </div>
    );
  }

  const { customer, items, subtotal, shipping, gst, total, createdAt } = order;
  const orderDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className={styles.container}>
      <div className={styles.successHeader}>
        <svg className={styles.checkIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h1 className={styles.title}>Order Placed Successfully!</h1>
        <p className={styles.subtitle}>
          Thank you for your purchase. Your order <span className={styles.orderId}>{order.orderId}</span> has been confirmed.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>Customer Details</div>
        <div className={styles.cardBody}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailGroup}>
              <div className={styles.label}>Contact Info</div>
              <div className={styles.value}>{customer.name}</div>
              <div className={styles.value}>{customer.email}</div>
              <div className={styles.value}>{customer.phone}</div>
            </div>
            <div className={styles.detailGroup}>
              <div className={styles.label}>Shipping Address</div>
              <div className={styles.value}>{customer.address.line1}</div>
              {customer.address.line2 && <div className={styles.value}>{customer.address.line2}</div>}
              <div className={styles.value}>
                {customer.address.city}, {customer.address.state} {customer.address.pincode}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>Order Summary</div>
        <div className={styles.cardBody}>
          <div style={{ marginBottom: '24px' }}>
            {items.map((item, idx) => (
              <div key={idx} className={styles.itemRow}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemMeta}>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                </div>
                <div className={styles.itemTotal}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: '300px', marginLeft: 'auto' }}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total Paid</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-muted)' }}>
        <p>Estimated delivery: <strong>5-7 business days</strong></p>
      </div>

      <div className={styles.actions}>
        <Link href="/products" className={styles.btnPrimary}>
          Continue Shopping
        </Link>
        <button className={styles.btnSecondary}>
          Track Order
        </button>
      </div>
    </div>
  );
}
