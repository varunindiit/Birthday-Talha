import { useCallback, useEffect, useState } from 'react';
import CursorGlow from './components/CursorGlow.jsx';
import Header from './components/Header.jsx';
import Loader from './components/Loader.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import { prefersReducedMotion, ScrollTrigger } from './lib/gsap.js';
import Celebration from './sections/Celebration.jsx';
import Finale from './sections/Finale.jsx';
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
  const replay = useCallback(() => {
    if (!prefersReducedMotion()) setPhase('loading');
  }, []);

  return (
    <SmoothScroll locked={phase !== 'done'}>
      {phase !== 'done' && <Loader onReveal={reveal} onDone={finish} />}
      <CursorGlow />
      <Header />
      <main>
        <Hero entered={phase !== 'loading'} />
        <Letter />
        <Celebration />
        <Finale onReplay={replay} />
      </main>
      <div className="grain" aria-hidden="true" />
    </SmoothScroll>
  );
}
