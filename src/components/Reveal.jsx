import { useRef } from 'react';
import { gsap, motion, prefersReducedMotion, useGSAP } from '../lib/gsap.js';

// Quiet rise-and-fade for supporting content, played once on entry.
export default function Reveal({ as: Tag = 'div', delay = 0, y = 28, start = 'top 88%', children, ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(ref.current, {
        y,
        autoAlpha: 0,
        duration: motion.base,
        ease: 'cine',
        delay,
        scrollTrigger: { trigger: ref.current, start, once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
