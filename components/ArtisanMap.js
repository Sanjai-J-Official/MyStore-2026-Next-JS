'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ArtisanMap.module.css';
import { INDIA_STATES } from '@/data/india-map';

/* centroid from path d string */
function centroid(d) {
  const nums = (d.replace(/[MmLlCcZz]/g, ' ').match(/-?\d+\.?\d*/g) || []).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  return {
    cx: xs.reduce((a, b) => a + b, 0) / (xs.length || 1),
    cy: ys.reduce((a, b) => a + b, 0) / (ys.length || 1),
  };
}

const lerp   = (a, b, t) => a + (b - a) * t;
const easeIO = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/* ─── Component ─────────────────────────────────────── */
export default function ArtisanMap() {
  const router     = useRouter();
  const sectionRef = useRef(null);
  const svgRef     = useRef(null);

  const [visible,      setVisible]      = useState(false);
  const [zoom,         setZoom]         = useState(0);
  const [parallax,     setParallax]     = useState(0);
  const [hoveredState, setHoveredState] = useState(null);
  const [activeState,  setActiveState]  = useState(null);
  const [tooltip,      setTooltip]      = useState(null);  // { x, y, stateId, mobile? }
  const [tooltipData,  setTooltipData]  = useState(null);  // { featured, total } from API
  const [loadingId,    setLoadingId]    = useState(null);  // state being fetched
  const [activeStates, setActiveStates] = useState(new Set()); // states with artisans
  const [isMobile,     setIsMobile]     = useState(false);

  /* Mobile detection */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Fetch which states have artisans (for gold highlight) + auto-seed */
  useEffect(() => {
    async function loadActiveStates() {
      try {
        // Auto-seed if DB is empty
        const res  = await fetch('/api/artisans');
        const json = await res.json();
        if (json.success && json.data.length === 0) {
          await fetch('/api/artisans/seed');
          const res2  = await fetch('/api/artisans');
          const json2 = await res2.json();
          if (json2.success) {
            setActiveStates(new Set(json2.data.map((a) => a.stateId)));
          }
        } else if (json.success) {
          setActiveStates(new Set(json.data.map((a) => a.stateId)));
        }
      } catch { /* silent fail — no artisans loaded */ }
    }
    loadActiveStates();
  }, []);

  /* IntersectionObserver — scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Scroll → zoom + parallax */
  useEffect(() => {
    if (!visible) return;
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      const prog = Math.min(Math.max((winH - rect.top) / (winH + rect.height * 0.4), 0), 1);
      setZoom(prog);
      const pct = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      setParallax(pct * -28);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [visible]);

  /* Fetch artisan data for hovered state */
  const fetchStateArtisan = useCallback(async (id) => {
    if (loadingId === id) return;
    setLoadingId(id);
    setTooltipData(null);
    try {
      const res  = await fetch(`/api/artisans/by-state/${id}`);
      const json = await res.json();
      if (json.success) setTooltipData(json.data);
    } catch { /* silently fail */ }
    finally { setLoadingId(null); }
  }, [loadingId]);

  /* Event handlers */
  const handleEnter = useCallback((e, id) => {
    if (isMobile || !activeStates.has(id)) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, stateId: id });
    setHoveredState(id);
    setActiveState(id);
    fetchStateArtisan(id);
  }, [isMobile, activeStates, fetchStateArtisan]);

  const handleMove = useCallback((e) => {
    if (isMobile) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip(prev => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
  }, [isMobile]);

  const handleLeave = useCallback(() => {
    if (isMobile) return;
    setTooltip(null);
    setHoveredState(null);
    setActiveState(null);
    setTooltipData(null);
  }, [isMobile]);

  const handleClick = useCallback((id) => {
    if (!activeStates.has(id) && !isMobile) return;
    if (isMobile) {
      if (activeState === id) {
        router.push(`/artisans/${id}`);
      } else {
        setActiveState(id);
        setTooltip({ x: 0, y: 0, stateId: id, mobile: true });
        fetchStateArtisan(id);
      }
    } else {
      router.push(`/artisans/${id}`);
    }
  }, [isMobile, activeState, activeStates, router, fetchStateArtisan]);

  /* ViewBox zoom interpolation */
  const ease      = easeIO(zoom);
  const baseVB    = [0, 0, 600, 650];
  const zoomVB    = [60, 60, 480, 530];
  const currentVB = baseVB.map((v, i) => Math.round(lerp(v, zoomVB[i], ease * 0.6))).join(' ');

  /* Tooltip position — flip to left near right edge */
  const getTooltipStyle = () => {
    if (!tooltip || tooltip.mobile) {
      return { bottom: '16px', left: '50%', transform: 'translateX(-50%)', top: 'auto', position: 'absolute' };
    }
    const wrapW  = svgRef.current?.getBoundingClientRect().width || 600;
    const cardW  = 240;
    const tryX   = tooltip.x + 22;
    const finalX = tryX + cardW > wrapW - 10 ? tooltip.x - cardW - 10 : tryX;
    return { left: Math.max(finalX, 6) + 'px', top: Math.max(tooltip.y - 50, 6) + 'px' };
  };

  return (
    <section
      id="artisan-map"
      ref={sectionRef}
      className={`${styles.mapSection} ${visible ? styles.visible : ''}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.sectionLabel}>Explore India</span>
        <h2 className={styles.sectionTitle}>Artisan Discovery Map</h2>
        <span className={styles.divider} />
        <p className={styles.subtitle}>
          {isMobile
            ? 'Tap a highlighted region to discover artisans. Tap again to explore.'
            : 'Hover a highlighted region to preview. Click to explore the full artisan collection.'}
        </p>
      </div>

      {/* Parallax wrapper */}
      <div
        className={styles.parallaxWrap}
        style={{ transform: `translateY(${parallax}px)` }}
      >
        <div className={styles.mapWrapper}>
          <svg
            ref={svgRef}
            className={`${styles.svg} ${styles.idleFloat}`}
            viewBox={currentVB}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            aria-label="India artisan discovery map"
            overflow="visible"
          >
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#C49A22" />
                <stop offset="50%"  stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#B38A2A" />
              </linearGradient>
              <linearGradient id="goldGradBright" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#E8C84A" />
                <stop offset="50%"  stopColor="#F5D55A" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
              <filter id="glowSoft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glowStrong" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feColorMatrix in="blur" type="matrix"
                  values="1 0.7 0 0 0  0.7 0.5 0 0 0  0 0 0 0 0  0 0 0 0.85 0" result="golden" />
                <feMerge><feMergeNode in="golden" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {INDIA_STATES.map((state) => {
              const hasData  = activeStates.has(state.id);
              const isHover  = hoveredState === state.id;
              const isActive = activeState  === state.id;
              const { cx, cy } = centroid(state.d);

              return (
                <g
                  key={state.id}
                  className={`${styles.stateGroup} ${hasData ? styles.stateGroupActive : ''}`}
                  style={isHover ? { transform: 'scale(1.045)' } : undefined}
                >
                  <path
                    d={state.d}
                    className={[
                      styles.statePath,
                      hasData    ? styles.stateActive      : styles.stateInactive,
                      isActive && !isHover ? styles.stateHighlighted : '',
                    ].join(' ')}
                    filter={
                      isHover   ? 'url(#glowStrong)' :
                      hasData   ? 'url(#glowSoft)'   : undefined
                    }
                    onMouseEnter={(e) => handleEnter(e, state.id)}
                    onMouseMove={handleMove}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick(state.id)}
                    role={hasData ? 'button' : undefined}
                    tabIndex={hasData ? 0 : undefined}
                    aria-label={hasData ? `Explore artisans from ${state.label}` : undefined}
                    onKeyDown={hasData ? (e) => { if (e.key === 'Enter') handleClick(state.id); } : undefined}
                  />
                  {hasData && (
                    <text
                      x={cx} y={cy}
                      className={styles.stateLabel}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      pointerEvents="none"
                    >
                      {state.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Glassmorphism Tooltip */}
          {tooltip && (
            <div className={styles.tooltip} style={getTooltipStyle()}>
              {(loadingId === tooltip.stateId || (!tooltipData && !loadingId)) ? (
                /* Loading shimmer */
                <div className={styles.tooltipShimmer}>
                  <div className={styles.shimmerImg} />
                  <div className={styles.shimmerBody}>
                    <div className={styles.shimmerLine} style={{ width: '60%' }} />
                    <div className={styles.shimmerLine} style={{ width: '80%' }} />
                    <div className={styles.shimmerLine} style={{ width: '50%' }} />
                  </div>
                </div>
              ) : tooltipData ? (
                <>
                  <div className={styles.tooltipImgWrap}>
                    <img
                      src={tooltipData.featured.image}
                      alt={tooltipData.featured.product}
                      className={styles.tooltipImg}
                    />
                  </div>
                  <div className={styles.tooltipBody}>
                    <div className={styles.tooltipRegion}>{tooltipData.featured.stateLabel}</div>
                    <div className={styles.tooltipArtisan}>{tooltipData.featured.name}</div>
                    <div className={styles.tooltipProduct}>{tooltipData.featured.product}</div>
                    {tooltipData.total > 1 && (
                      <div className={styles.tooltipCount}>+{tooltipData.total - 1} more artisan{tooltipData.total > 2 ? 's' : ''}</div>
                    )}
                    <div
                      className={styles.tooltipCta}
                      onClick={() => router.push(`/artisans/${tooltip.stateId}`)}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      View Collection
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendDot} style={{ background: 'var(--hl-gold)' }} />
            <span>Artisan region</span>
            <div className={styles.legendDot} style={{ background: '#2A1E14', border: '1px solid #3D2D1E' }} />
            <span>Other states</span>
          </div>
        </div>

        {/* Desktop active-state story card */}
        {!isMobile && activeState && tooltipData && (
          <div className={styles.activeCard}>
            <img src={tooltipData.featured.image} alt="" className={styles.activeCardImg} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={styles.activeCardRegion}>{tooltipData.featured.stateLabel}</div>
              <p className={styles.activeCardStory}>{tooltipData.featured.description}</p>
            </div>
            <button
              className={styles.activeCardBtn}
              onClick={() => router.push(`/artisans/${activeState}`)}
            >
              View Collection &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
