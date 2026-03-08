import styles from './Skeleton.module.css';

export function ProductCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.image} ${styles.shimmer}`}></div>
      <div className={styles.content}>
        <div className={`${styles.line} ${styles.short} ${styles.shimmer}`}></div>
        <div className={`${styles.line} ${styles.long} ${styles.shimmer}`}></div>
        <div className={`${styles.line} ${styles.long} ${styles.shimmer}`}></div>
        <div className={`${styles.price} ${styles.shimmer}`}></div>
        <div className={`${styles.button} ${styles.shimmer}`}></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}
