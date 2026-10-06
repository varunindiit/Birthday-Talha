import { useRef } from 'react';
import Magnetic from '../components/Magnetic.jsx';
import { useLenis } from '../components/SmoothScroll.jsx';
import SplitReveal from '../components/SplitReveal.jsx';
import { dateLabel, finale, sender } from '../lib/content.js';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap.js';
import './Finale.css';

// Scene four. The wish itself, as the light comes up.
export default function Finale({ onReplay }) {
  const root = useRef(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '.finale__sun',
        { scale: 0.4, yPercent: 26 },
        {
          scale: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
        },
      );
      gsap.from('.finale__rule', {
        scaleX: 0,
        duration: 1.8,
        ease: 'curtain',
        scrollTrigger: { trigger: '.finale__foot', start: 'top 96%', once: true },
      });
    },
    { scope: root },
  );

  const replay = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.8, onComplete: onReplay });
    } else {
      window.scrollTo(0, 0);
      onReplay();
    }
  };

  return (
    <section ref={root} className="finale sheet sheet--rounded" aria-labelledby="finale-title">
      <div className="finale__sun" aria-hidden="true" />

      <div className="finale__inner">
        <SplitReveal as="h2" id="finale-title" className="finale__wish" start="top 78%">
          {finale.wish}
        </SplitReveal>
        <SplitReveal as="p" className="finale__from" delay={0.45} start="top 92%">
          {finale.from}
        </SplitReveal>
      </div>

      <footer className="finale__foot">
        <span className="finale__rule" aria-hidden="true" />
        <p>
          Made with care by {sender}, {dateLabel}
        </p>
        <Magnetic>
          <button type="button" className="button button--ghost" onClick={replay}>
            {finale.replay}
          </button>
        </Magnetic>
      </footer>
    </section>
  );
}
