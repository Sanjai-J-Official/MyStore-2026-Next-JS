import styles from '../admin.module.css';

export default function SettingsPlaceholder() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Store Settings</h1>
      </div>
      <div className={styles.section} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>⚙️ Setup coming soon</p>
        <p>This panel will eventually control global store settings such as taxes, payment gateways, and shipping zones.</p>
      </div>
    </div>
  );
}
