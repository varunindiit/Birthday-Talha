import { useRef } from 'react';
import { hero, person } from '../lib/content.js';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap.js';
import './Hero.css';

// Scene one. The name fills the screen and Talha rises into it.
// `entered` flips to true as the opening curtain lifts.
export default function Hero({ entered }) {
  const root = useRef(null);

  // Entrance — plays once per curtain lift.
  useGSAP(
    () => {
      if (!entered || prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: 'cine' }, delay: 0.3 })
        .from('.hero__glow', { scale: 0.55, autoAlpha: 0, duration: 2.2, ease: 'power2.out' }, 0)
        .from('.hero__char', { yPercent: 112, duration: 1.4, stagger: 0.075 }, 0.15)
        .from(
          '.hero__portrait-clip',
          { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'curtain' },
          0.35,
        )
        .from('.hero__portrait-img', { scale: 1.16, yPercent: 8, duration: 2, ease: 'power3.out' }, 0.35)
        .from('.hero__greeting-inner', { yPercent: 115, duration: 1.1 }, 0.95)
        .from('.hero__lede, .hero__scroll', { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, 1.35);
    },
    { scope: root, dependencies: [entered], revertOnUpdate: true },
  );

  // Scroll — the scene sinks back as the letter slides over it.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${window.innerHeight}`,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
        .to('.hero__title', { yPercent: -22 }, 0)
        .to('.hero__portrait', { yPercent: 5, scale: 1.06 }, 0)
        .to('.hero__glow-wrap', { scale: 1.3 }, 0)
        .to('.hero__foot', { autoAlpha: 0, duration: 0.3 }, 0)
        .to('.hero__shade', { opacity: 0.6 }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="hero">
      <div className="hero__glow-wrap" aria-hidden="true">
        <div className="hero__glow" />
      </div>

      <div className="hero__stack">
        <h1 className="hero__title">
          <span className="sr-only">
            {hero.greeting} {person}
          </span>
          <span className="hero__greeting" aria-hidden="true">
            <span className="hero__greeting-inner">{hero.greeting}</span>
          </span>
          <span className="hero__name" aria-hidden="true">
            {[...person].map((char, index) => (
              <span key={index} className="hero__char">
                {char}
              </span>
            ))}
          </span>
        </h1>

        <div className="hero__portrait">
          <div className="hero__portrait-clip">
            <img
              className="hero__portrait-img"
              src={hero.portrait.src}
              width={hero.portrait.width}
              height={hero.portrait.height}
              alt={`Portrait of ${person}`}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="hero__foot">
        <p className="hero__lede">{hero.lede}</p>
        <a className="hero__scroll" href="#letter">
          <span>Scroll to open your letter</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </a>
      </div>

      <div className="hero__shade" aria-hidden="true" />
    </section>
  );
}
