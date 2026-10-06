import { useEffect, useRef, useState } from 'react';
import Embers from '../components/Embers.jsx';
import Magnetic from '../components/Magnetic.jsx';
import Reveal from '../components/Reveal.jsx';
import SplitReveal from '../components/SplitReveal.jsx';
import { createConfetti } from '../lib/confetti.js';
import { celebration } from '../lib/content.js';
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from '../lib/gsap.js';
import './Celebration.css';

// Scene three. One candle, and the reader lights it.
export default function Celebration() {
  const root = useRef(null);
  const canvas = useRef(null);
  const confetti = useRef(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    confetti.current = createConfetti(canvas.current);
    return () => confetti.current.destroy();
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return undefined;

      // The year ahead, counted up as it scrolls into view.
      const number = root.current.querySelector('.celebration__days-number');
      const counter = { value: 0 };
      number.textContent = '0';
      gsap.to(counter, {
        value: celebration.days,
        duration: 2.6,
        ease: 'power3.out',
        snap: { value: 1 },
        onUpdate: () => {
          number.textContent = String(counter.value);
        },
        scrollTrigger: { trigger: number, start: 'top 88%', once: true },
      });

      return () => {
        number.textContent = String(celebration.days);
      };
    },
    { scope: root },
  );

  const light = contextSafe(() => {
    if (!prefersReducedMotion()) {
      if (!lit) {
        gsap
          .timeline()
          .fromTo(
            '.candle__flame',
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'back.out(2.4)' },
            0,
          )
          .fromTo(
            '.candle__halo',
            { scale: 0.2, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 1.6, ease: 'cine' },
            0,
          )
          .fromTo(
            '.celebration__bloom',
            { scale: 0.5, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 2.2, ease: 'power2.out' },
            0,
          );
      }

      // Confetti rises from the wick, then from both wings of the stage.
      const wick = root.current.querySelector('.candle__wick').getBoundingClientRect();
      const scale = hasFinePointer() ? 1 : 0.6;
      const { innerWidth: width, innerHeight: height } = window;
      confetti.current.burst({
        x: wick.left + wick.width / 2,
        y: wick.top,
        count: Math.round(130 * scale),
        power: 22,
      });
      gsap.delayedCall(0.3, () => {
        confetti.current.burst({
          x: width * 0.08,
          y: height * 0.96,
          angle: -Math.PI / 3,
          spread: 0.8,
          count: Math.round(70 * scale),
          power: 30,
        });
        confetti.current.burst({
          x: width * 0.92,
          y: height * 0.96,
          angle: (-Math.PI * 2) / 3,
          spread: 0.8,
          count: Math.round(70 * scale),
          power: 30,
        });
      });
    }
    setLit(true);
  });

  return (
    <section ref={root} className={`celebration sheet sheet--rounded${lit ? ' is-lit' : ''}`} aria-labelledby="celebration-title">
      <Embers className="celebration__embers" />
      <div className="celebration__bloom" aria-hidden="true" />

      <div className="celebration__stage">
        <Reveal className="candle" y={40}>
          <span className="candle__halo" aria-hidden="true" />
          <svg className="candle__flame" viewBox="0 0 24 40" aria-hidden="true">
            <defs>
              <linearGradient id="candle-flame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ff6a3d" />
                <stop offset="0.55" stopColor="#ffb347" />
                <stop offset="1" stopColor="#fff6e0" />
              </linearGradient>
            </defs>
            <g className="candle__flame-core">
              <path d="M12 0c5 9 11 16 11 26a11 11 0 0 1-22 0C1 16 7 9 12 0z" fill="url(#candle-flame)" />
              <path d="M12 17c2.5 4 5 7 5 11a5 5 0 0 1-10 0c0-4 2.5-7 5-11z" fill="#fff6e0" opacity="0.85" />
            </g>
          </svg>
          <span className="candle__wick" aria-hidden="true" />
          <span className="candle__body" aria-hidden="true" />
        </Reveal>

        <SplitReveal as="h2" id="celebration-title" className="celebration__title">
          {celebration.title}
        </SplitReveal>

        <p key={lit ? 'after' : 'before'} className="celebration__line">
          {lit ? celebration.after : celebration.before}
        </p>

        <Reveal className="celebration__action" delay={0.2}>
          <Magnetic>
            <button type="button" className="button" onClick={light}>
              {lit ? celebration.again : celebration.light}
            </button>
          </Magnetic>
        </Reveal>

        <p className="sr-only" role="status">
          {lit ? celebration.status : ''}
        </p>
      </div>

      <Reveal className="celebration__days">
        <span className="celebration__days-number">{celebration.days}</span>
        <span className="celebration__days-label">{celebration.daysLabel}</span>
      </Reveal>

      <canvas ref={canvas} className="celebration__confetti" aria-hidden="true" />
    </section>
  );
}
