import { useCallback, useEffect, useState } from 'react';
import CursorGlow from './components/CursorGlow.jsx';
import Loader from './components/Loader.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import { prefersReducedMotion, ScrollTrigger } from './lib/gsap.js';
import Hero from './sections/Hero.jsx';
import Letter from './sections/Letter.jsx';

// The page moves through three phases:
//   loading   — opening titles cover the screen, scrolling is held
//   revealing — the curtain lifts and the hero makes its entrance
//   done      — the page is the reader's to scroll
// Reduced-motion visitors skip straight to "done".
export default function App() {
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? 'done' : 'loading'));

  useEffect(() => {
    // Always open on scene one, and re-measure once the fonts have settled.
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const reveal = useCallback(() => setPhase('revealing'), []);
  const finish = useCallback(() => setPhase('done'), []);

  return (
    <SmoothScroll locked={phase !== 'done'}>
      {phase !== 'done' && <Loader onReveal={reveal} onDone={finish} />}
      <CursorGlow />
      <main>
        <Hero entered={phase !== 'loading'} />
        <Letter />
      </main>
      <div className="grain" aria-hidden="true" />
    </SmoothScroll>
  );
}
