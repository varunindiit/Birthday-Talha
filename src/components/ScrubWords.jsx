import { useRef } from 'react';
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '../lib/gsap.js';

// "Inks in" a paragraph word by word as it travels up the viewport,
// so the reader's own scrolling sets the pace of the message.
export default function ScrubWords({ as: Tag = 'p', children, ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const split = SplitText.create(ref.current, { type: 'words' });
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 82%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
