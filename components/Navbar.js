'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16.5" y2="16.5" />
  </svg>
);

const CartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* minimal luxury bag icon */}
    <path d="M6 8h12l-1 10H7L6 8z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </svg>
);

const HamburgerIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

const leftLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
];

const rightLinks = [
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navbarClassName = [
    styles.navbar,
    isScrolled ? styles.navbarScrolled : '',
    mobileOpen ? styles.navbarMobileOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  const renderNavLink = (link) => (
    <li key={link.name} className={styles.navItem}>
      <Link
        href={link.path}
        className={`${styles.navLink} ${
          pathname === link.path ? styles.navLinkActive : ''
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <span className={styles.navLinkInner}>{link.name}</span>
      </Link>
    </li>
  );

  return (
    <>
      <nav className={navbarClassName} aria-label="Main navigation">
        <div className={styles.glassOverlay} aria-hidden="true" />

        <div className={styles.navContainer}>
          {/* DESKTOP LAYOUT: left / center / right columns */}
          <div className={styles.desktopRow}>
            <div className={styles.desktopSideLeft}>
              <ul className={styles.navList}>
                {leftLinks.map(renderNavLink)}
              </ul>
            </div>

            <div className={styles.desktopCenter}>
              <Link
                href="/"
                className={styles.brand}
                aria-label="Hidden Leaf — Home"
              >
                {/* Logo image — /public/logo.png */}
                <Image
                  src="/logo.png"
                  alt="Hidden Leaf logo"
                  width={42}
                  height={42}
                  className={styles.brandLogoIcon}
                  priority
                />

                {/* Brand name + decorative lines stacked vertically */}
                <div className={styles.brandTextColumn}>
                  <span className={styles.brandCrystalMask}>
                    <span className={styles.brandText}>Hidden Leaf</span>
                    <span className={styles.brandSweep} aria-hidden="true" />
                  </span>
                  <span className={styles.brandLineGroup} aria-hidden="true">
                    <span className={styles.brandLine} />
                    <span className={styles.brandDot} />
                    <span className={styles.brandLine} />
                  </span>
                </div>
              </Link>
            </div>

            <div className={styles.desktopSideRight}>
              <ul className={styles.navList}>
                {rightLinks.map(renderNavLink)}
              </ul>

              <div className={styles.actionGroup}>
                <div
                  className={`${styles.search} ${
                    searchFocused ? styles.searchFocused : ''
                  }`}
                >
                  <button
                    type="button"
                    className={styles.searchButton}
                    aria-label="Search"
                    onClick={() => searchRef.current?.focus()}
                  >
                    <SearchIcon />
                  </button>
                  <input
                    ref={searchRef}
                    type="search"
                    className={styles.searchInput}
                    placeholder="Search"
                    aria-label="Search products"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>

                <Link
                  href="/cart"
                  className={styles.cartButton}
                  aria-label={`Cart, ${totalItems} item${
                    totalItems === 1 ? '' : 's'
                  }`}
                >
                  <CartIcon />
                  {totalItems > 0 && (
                    <span className={styles.cartBadge} aria-hidden="true">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT: hamburger / centered brand / cart */}
          <div className={styles.mobileRow}>
            <button
              type="button"
              className={styles.mobileToggle}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>

            {/* Mobile: only logo icon, perfectly centered via absolute positioning */}
            <Link
              href="/"
              className={styles.brandMobile}
              aria-label="Hidden Leaf — Home"
            >
              <Image
                src="/logo.png"
                alt="Hidden Leaf logo"
                width={38}
                height={38}
                className={styles.brandLogoIconMobile}
                priority
              />
            </Link>

            <Link
              href="/cart"
              className={styles.cartButton}
              aria-label={`Cart, ${totalItems} item${
                totalItems === 1 ? '' : 's'
              }`}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className={styles.cartBadge} aria-hidden="true">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div
          className={`${styles.mobileDrawer} ${
            mobileOpen ? styles.mobileDrawerOpen : ''
          }`}
          aria-hidden={!mobileOpen}
        >
          <ul className={styles.mobileNavList}>
            {[...leftLinks, ...rightLinks].map((link) => (
              <li key={link.name} className={styles.mobileNavItem}>
                <Link
                  href={link.path}
                  className={`${styles.mobileNavLink} ${
                    pathname === link.path ? styles.mobileNavLinkActive : ''
                  }`}
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.mobileSearch}>
            <SearchIcon />
            <input
              type="search"
              className={styles.mobileSearchInput}
              placeholder="Search products"
              aria-label="Search products"
              tabIndex={mobileOpen ? 0 : -1}
            />
          </div>

          <span className={styles.mobileSignature} aria-hidden="true">
            Hidden Leaf · Handcrafted Wood
          </span>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;