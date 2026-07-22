"use client";

import {
  useRef,
  type ReactNode,
  type ComponentType,
  type ElementType,
} from "react";

import { gsap } from "gsap";
import { useUIStore } from "@/lib/store";

/**
 * Magnetic button using GSAP quickTo — the element (and its inner label) is
 * pulled toward the pointer within its bounds, then springs back on leave.
 * Used for nav toggle, social links, and CTAs.
 */
type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: ElementType;
} & Record<string, unknown>;

export default function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    className = "",
    strength = 0.4,
    as = "button",
    ...rest
  } = props;
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);
  const ixTo = useRef<((v: number) => void) | null>(null);
  const iyTo = useRef<((v: number) => void) | null>(null);

  const ensureQuickTo = () => {
    if (reducedMotion) return;
    if (!xTo.current && ref.current) {
      const opts = { duration: 0.6, ease: "elastic.out(1, 0.4)" };
      xTo.current = gsap.quickTo(ref.current, "x", opts);
      yTo.current = gsap.quickTo(ref.current, "y", opts);
    }
    if (!ixTo.current && innerRef.current) {
      const opts = { duration: 0.6, ease: "elastic.out(1, 0.4)" };
      ixTo.current = gsap.quickTo(innerRef.current, "x", opts);
      iyTo.current = gsap.quickTo(innerRef.current, "y", opts);
    }
  };

  const onMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return;
    ensureQuickTo();
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    xTo.current?.(relX * strength);
    yTo.current?.(relY * strength);
    ixTo.current?.(relX * strength * 0.5);
    iyTo.current?.(relY * strength * 0.5);
  };

  const onLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);
    ixTo.current?.(0);
    iyTo.current?.(0);
  };

  // Cast to a permissive component type so a union `as` prop does not collapse
  // the accepted props (including children) to `never`.
  const Tag = as as ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  }>;
  const tagProps = {
    ref,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    "data-cursor": "link",
    className: `relative inline-flex items-center justify-center ${className}`,
    ...rest,
  };

  return (
    <Tag {...tagProps}>
      <span ref={innerRef} className="inline-flex items-center justify-center">
        {children}
      </span>
    </Tag>
  );
}
