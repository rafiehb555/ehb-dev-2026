"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
}

/**
 * Fade-in on scroll. Uses IntersectionObserver; animations are transform + opacity for performance.
 */
export function SectionReveal({ children, className = "", as: Tag = "section" }: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Inline opacity/transform so sections stay usable if Tailwind CSS chunks fail to load (dev cache / blocked _next). */
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      data-ehb-section-reveal=""
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(1.5rem)",
        transition: "opacity 500ms ease, transform 500ms ease",
        willChange: visible ? "auto" : "transform, opacity",
      }}
    >
      {children}
    </Tag>
  );
}
