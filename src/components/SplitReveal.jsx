import { useRef } from 'react';
import { gsap, motion, prefersReducedMotion, SplitText, useGSAP } from '../lib/gsap.js';

// Reveals text line by line from behind a mask the first time it scrolls into view.
// Lines are re-split automatically when fonts load or the layout changes.
export default function SplitReveal({
  as: Tag = 'p',
  delay = 0,
  stagger = 0.1,
  start = 'top 85%',
  children,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      SplitText.create(ref.current, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: motion.slow,
            ease: 'cine',
            stagger,
            delay,
            scrollTrigger: { trigger: ref.current, start, once: true },
          }),
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
