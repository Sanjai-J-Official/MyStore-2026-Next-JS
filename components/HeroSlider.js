'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSlider.module.css';

// ---------------------------------------------------------------------------
// Slide data — place images in /public/banners/ and update href as needed.
// ---------------------------------------------------------------------------
const SLIDES = [
  {
    id: 1,
    src: '/banners/slide-1.jpg',
    alt: 'Hidden Leaf — Handcrafted Wooden Furniture',
    href: '/products?category=Furniture',
  },
  {
    id: 2,
    src: '/banners/slide-2.jpg',
    alt: 'Hidden Leaf — Artisan Wooden Decor',
    href: '/products?category=Decor',
  },
  {
    id: 3,
    src: '/banners/slide-3.jpg',
    alt: 'Hidden Leaf — Premium Wooden Kitchenware',
    href: '/products?category=Kitchenware',
  },
  {
    id: 4,
    src: '/banners/slide-4.jpg',
    alt: 'Hidden Leaf — Luxury Wooden Accessories',
    href: '/products?category=Accessories',
  },
  {
    id: 5,
    src: '/banners/slide-5.jpg',
    alt: 'Hidden Leaf — New Collection 2024',
    href: '/products',
  },
];

const SLIDE_INTERVAL = 4500; // ms
const TRANSITION_MS  = 600;  // must match CSS animation duration

export default function HeroSlider() {
  const total      = SLIDES.length;
  const [current,  setCurrent]  = useState(0);
  const [previous, setPrevious] = useState(null);
  const [forward,  setForward]  = useState(true);  // true = RTL, false = LTR
  const [locked,   setLocked]   = useState(false);

  const intervalRef = useRef(null);
  const hovered     = useRef(false);

  // ── Navigate to any index ───────────────────────────────────────────────
  const goTo = useCallback(
    (rawIndex) => {
      if (locked) return;
      const next = (rawIndex + total) % total;
      if (next === current) return;

      setForward(rawIndex >= current); // determines animation direction
      setPrevious(current);
      setCurrent(next);
      setLocked(true);

      setTimeout(() => {
        setPrevious(null);
        setLocked(false);
      }, TRANSITION_MS);
    },
    [locked, current, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // ── Auto-slide ──────────────────────────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!hovered.current) {
        setCurrent((c) => {
          const n = (c + 1) % total;
          setPrevious(c);
          setForward(true);
          setLocked(true);
          setTimeout(() => { setPrevious(null); setLocked(false); }, TRANSITION_MS);
          return n;
        });
      }
    }, SLIDE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [total]);

  // ── Keyboard navigation ─────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // ── Determine per-slide CSS class ───────────────────────────────────────
  const getSlideClass = (i) => {
    if (i === current && previous === null) return styles.slideVisible;  // idle / initial
    if (i === current  && previous !== null) return forward ? styles.slideEnterRight : styles.slideEnterLeft;
    if (i === previous) return forward ? styles.slideExitLeft : styles.slideExitRight;
    return styles.slideHidden;
  };

  return (
    <section
      className={styles.sliderRoot}
      aria-label="Hero banner slider"
      onMouseEnter={() => { hovered.current = true;  }}
      onMouseLeave={() => { hovered.current = false; }}
    >
      {/* ── Slide track ── */}
      <div className={styles.track}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${getSlideClass(i)}`}
            aria-hidden={i !== current}
          >
            <Link
              href={slide.href}
              className={styles.slideLink}
              tabIndex={i === current ? 0 : -1}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                quality={100}
                sizes="100vw"
                className={styles.slideImage}
                draggable={false}
              />
            </Link>
          </div>
        ))}
      </div>

      {/* ── Left arrow ── */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={prev}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* ── Right arrow ── */}
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={next}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dot indicators ── */}
      <div className={styles.dots} role="tablist" aria-label="Slide indicators">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
