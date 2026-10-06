import { useRef } from 'react';
import { dateLabel, person, sender } from '../lib/content.js';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap.js';
import './Header.css';

// Fixed masthead: who it's from, who it's for, and how far through you are.
export default function Header() {
  const root = useRef(null);
  const bar = useRef(null);

  useGSAP(
    () => {
      // Switch to dark ink while the champagne letter is underneath.
      const light = document.querySelector('[data-tone="light"]');
      if (light) {
        ScrollTrigger.create({
          trigger: light,
          start: 'top 2.5rem',
          end: 'bottom 2.5rem',
          toggleClass: { targets: root.current, className: 'is-on-light' },
        });
      }

      // Step aside while the reader scrolls down; come back when they scroll up.
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          root.current.classList.toggle('is-tucked', self.direction === 1 && self.scroll() > 160);
        },
      });

      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: prefersReducedMotion() ? true : 0.4 },
        },
      );
    },
    { scope: root },
  );

  return (
    <header ref={root} className="site-header">
      <div className="site-header__bar">
        <a className="site-header__brand" href="#top" aria-label={`${sender} — back to the top`}>
          {sender}
        </a>
        <p className="site-header__meta">
          For {person}, {dateLabel}
        </p>
      </div>
      <span className="site-header__progress" aria-hidden="true">
        <span ref={bar} />
      </span>
    </header>
  );
}
