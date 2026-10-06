import { useRef } from 'react';
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from '../lib/gsap.js';

// Lets its child lean towards the pointer, then spring back. Mouse only.
export default function Magnetic({ strength = 0.3, children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (prefersReducedMotion() || !hasFinePointer()) return undefined;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.45)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.45)' });

      const onMove = (event) => {
        const box = el.getBoundingClientRect();
        xTo((event.clientX - (box.left + box.width / 2)) * strength);
        yTo((event.clientY - (box.top + box.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
