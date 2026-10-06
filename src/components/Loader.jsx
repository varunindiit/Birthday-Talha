import { useRef } from 'react';
import { hero, person, sender } from '../lib/content.js';
import { gsap, useGSAP } from '../lib/gsap.js';
import './Loader.css';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function preloadHero() {
  const image = new Image();
  image.src = hero.portrait.src;
  return image.decode().catch(() => {});
}

// Opening titles: "Indiit Solutions presents" → the name → curtain up.
// `onReveal` fires as the curtain starts to lift (the hero begins its entrance
// underneath); `onDone` fires once the curtain has left the screen.
export default function Loader({ onReveal, onDone }) {
  const root = useRef(null);

  useGSAP(
    () => {
      let cancelled = false;
      let titlesDone = false;
      let assetsReady = false;

      const exit = gsap
        .timeline({ paused: true, defaults: { ease: 'curtain' }, onComplete: onDone })
        .to('.loader__content', { yPercent: -14, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 0)
        .add(onReveal, 0.2)
        .to('.loader__panel--dark', { yPercent: -100, duration: 1.05 }, 0.35)
        .to('.loader__panel--flame', { yPercent: -100, duration: 1.05 }, 0.5);

      const tryExit = () => {
        if (!cancelled && titlesDone && assetsReady) exit.play();
      };

      const titles = gsap
        .timeline({
          paused: true,
          defaults: { ease: 'cine' },
          onComplete: () => {
            titlesDone = true;
            tryExit();
          },
        })
        .set('.loader__content', { autoAlpha: 1 })
        .from('.loader__presents-inner', { yPercent: 115, duration: 0.9 }, 0.1)
        .from('.loader__rule', { scaleX: 0, duration: 1.1, ease: 'curtain' }, 0.3)
        .from('.loader__char', { yPercent: 118, duration: 1.1, stagger: 0.07 }, 0.55)
        .from('.loader__occasion-inner', { yPercent: 115, duration: 0.9 }, 0.95)
        .to({}, { duration: 0.35 });

      // Start the titles once the display face is in, so they never reflow mid-animation.
      Promise.race([document.fonts.load('900 1em "Fraunces Variable"'), wait(1200)]).then(() => {
        if (!cancelled) titles.play();
      });

      // Hold the curtain until the hero portrait can paint, but never for long.
      Promise.race([Promise.all([document.fonts.ready, preloadHero()]), wait(3000)]).then(() => {
        assetsReady = true;
        tryExit();
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="loader" role="status" aria-label={`A birthday wish for ${person} is loading`}>
      <div className="loader__panel loader__panel--flame" />
      <div className="loader__panel loader__panel--dark" />
      <div className="loader__content" aria-hidden="true">
        <p className="loader__presents">
          <span className="loader__presents-inner">{sender} presents</span>
        </p>
        <span className="loader__rule" />
        <p className="loader__name">
          {[...person].map((char, index) => (
            <span key={index} className="loader__char">
              {char}
            </span>
          ))}
        </p>
        <p className="loader__occasion">
          <span className="loader__occasion-inner">A birthday, in two short scenes</span>
        </p>
      </div>
    </div>
  );
}
