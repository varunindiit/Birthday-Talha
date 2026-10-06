import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

// Shared easing: "cine" settles long and soft, "curtain" is the wipe used between scenes.
CustomEase.create('cine', '0.16, 1, 0.3, 1');
CustomEase.create('curtain', '0.76, 0, 0.24, 1');

// Motion tokens — every component draws its timing from here.
export const motion = {
  fast: 0.5,
  base: 0.9,
  slow: 1.3,
  stagger: 0.08,
};

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Media queries shared by gsap.matchMedia() blocks.
export const media = {
  desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
};

export { gsap, ScrollTrigger, SplitText, useGSAP };
