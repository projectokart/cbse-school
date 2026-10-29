'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
  rootMargin?: string;
  id?: string;
}

/**
 * LazySection: Defers rendering of below-the-fold sections until
 * they are about to scroll into viewport (250px ahead), or when idle.
 * Once mounted, it permanently caches and retains its DOM state.
 */
export default function LazySection({
  children,
  fallback,
  minHeight = '280px',
  rootMargin = '400px',
  id,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already visible, do nothing
    if (isVisible) return;

    // Use IntersectionObserver to mount when near viewport
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin: rootMargin,
          threshold: 0.01,
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      // Idle fallback: Mount after 1.2s during idle browser cycles
      const idleCallback = (window as any).requestIdleCallback
        ? (window as any).requestIdleCallback(() => setIsVisible(true), { timeout: 1500 })
        : setTimeout(() => setIsVisible(true), 1200);

      return () => {
        observer.disconnect();
        if ((window as any).cancelIdleCallback && typeof idleCallback === 'number') {
          (window as any).cancelIdleCallback(idleCallback);
        } else {
          clearTimeout(idleCallback as any);
        }
      };
    } else {
      // Fallback for environments without IntersectionObserver
      setIsVisible(true);
    }
  }, [isVisible, rootMargin]);

  return (
    <div ref={containerRef} id={id} style={{ minHeight: isVisible ? 'auto' : minHeight }}>
      {isVisible ? (
        <div className="animate-fade-in transition-opacity duration-300">
          {children}
        </div>
      ) : (
        fallback || (
          <div className="w-full py-16 flex flex-col items-center justify-center space-y-3 opacity-60">
            <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-[#005689] animate-spin" />
            <span className="text-xs font-semibold text-slate-400">Loading section...</span>
          </div>
        )
      )}
    </div>
  );
}
