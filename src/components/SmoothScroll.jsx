import Lenis from 'lenis';
import { createContext, useContext, useEffect, useState } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap.js';

const LenisContext = createContext(null);

// Returns the Lenis instance, or null when native scrolling is in use.
export const useLenis = () => useContext(LenisContext);

// Smooth scrolling for wheel input, driven by GSAP's ticker so Lenis and
// ScrollTrigger share one animation loop. Touch scrolling stays native, and
// reduced-motion users get native scrolling everywhere.
export default function SmoothScroll({ locked = false, children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const instance = new Lenis({ lerp: 0.1, anchors: true });
    const onTick = (time) => instance.raf(time * 1000);

    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // While the intro plays the page is held at the top.
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', locked);
    if (locked) {
      lenis?.stop();
      window.scrollTo(0, 0);
    } else {
      lenis?.start();
    }
    return () => document.documentElement.classList.remove('is-locked');
  }, [locked, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
