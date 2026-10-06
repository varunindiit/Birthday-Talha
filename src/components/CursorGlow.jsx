import { useRef } from 'react';
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from '../lib/gsap.js';
import './CursorGlow.css';

// Candlelight that follows the pointer. Mouse only; touch and reduced motion get nothing.
export default function CursorGlow() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (prefersReducedMotion() || !hasFinePointer()) return undefined;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' });
      let shown = false;

      const onMove = (event) => {
        xTo(event.clientX);
        yTo(event.clientY);
        if (!shown) {
          shown = true;
          gsap.set(el, { x: event.clientX, y: event.clientY });
          gsap.to(el, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' });
        }
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      return () => window.removeEventListener('pointermove', onMove);
    },
    { scope: ref },
  );

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
