'use client';

import { useToast } from '@/context/ToastContext';
import styles from './Toast.module.css';

export default function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
