import { useRef } from 'react';
import Reveal from '../components/Reveal.jsx';
import SplitReveal from '../components/SplitReveal.jsx';
import { dateLabel, dateNumerals, frames } from '../lib/content.js';
import { gsap, hasFinePointer, media, useGSAP } from '../lib/gsap.js';
import './Frames.css';

// Resting tilt of the print, in degrees — keep in step with .frame--print .frame__mask.
const PRINT_TILT = -3;

// Scene three. One photograph, hung three ways.
//
// Desktop beat sheet — the gallery pins and travels sideways (budget = track width):
//   1. Establish   0–20%   The headline holds; the poster edges into view.
//   2. Poster     20–45%   The cut-out crosses centre; the date drifts behind him.
//   3. Close-up   45–70%   The arch arrives in monochrome and warms into colour.
//   4. Original   70–100%  The untouched print lands; the toast closes the scene.
// Phones and tablets get the short cut: no pin, each frame unveils as it scrolls in.
export default function Frames() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(media.desktop, () => {
        const track = root.current.querySelector('.frames__track');
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.frames__viewport',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray('.frame').forEach((frame, index) => {
          gsap.from(frame.querySelector('.frame__mask'), {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.3,
            ease: 'curtain',
            // The first frame is already on screen when the gallery pins, so it
            // unveils as the scene arrives; the rest unveil as they travel in.
            scrollTrigger:
              index === 0
                ? { trigger: '.frames__viewport', start: 'top 45%', once: true }
                : { trigger: frame, containerAnimation: travel, start: 'left 88%', once: true },
          });
          gsap.fromTo(
            frame.querySelector('.frame__drift'),
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                containerAnimation: travel,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
        });

        gsap.fromTo(
          '.frame__numerals',
          { xPercent: 14 },
          {
            xPercent: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: '.frame--poster',
              containerAnimation: travel,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );

        // Monochrome until the close-up reaches the middle of the screen.
        gsap.fromTo(
          '.frame--arch .frame__photo',
          { filter: 'grayscale(1)' },
          {
            filter: 'grayscale(0)',
            ease: 'none',
            scrollTrigger: {
              trigger: '.frame--arch',
              containerAnimation: travel,
              start: 'left 78%',
              end: 'center 50%',
              scrub: true,
            },
          },
        );

        gsap.from('.frames__toast', {
          yPercent: 35,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'cine',
          scrollTrigger: { trigger: '.frames__outro', containerAnimation: travel, start: 'left 78%', once: true },
        });
      });

      mm.add(media.mobile, () => {
        gsap.utils.toArray('.frame').forEach((frame) => {
          gsap.from(frame.querySelector('.frame__mask'), {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.2,
            ease: 'curtain',
            scrollTrigger: { trigger: frame, start: 'top 82%', once: true },
          });
          gsap.fromTo(
            frame.querySelector('.frame__drift'),
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });

        gsap.fromTo(
          '.frame--arch .frame__photo',
          { filter: 'grayscale(1)' },
          {
            filter: 'grayscale(0)',
            ease: 'none',
            scrollTrigger: { trigger: '.frame--arch', start: 'top 70%', end: 'center 50%', scrub: true },
          },
        );

        gsap.from('.frames__toast', {
          yPercent: 35,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'cine',
          scrollTrigger: { trigger: '.frames__outro', start: 'top 85%', once: true },
        });
      });

      // The print reacts to how fast the pointer arrives, like a photo nudged on a table.
      if (hasFinePointer()) {
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          const print = root.current.querySelector('.frame--print .frame__mask');
          let last = null;
          const onMove = (event) => {
            last = { x: event.clientX, y: event.clientY, vx: event.movementX, vy: event.movementY };
          };
          const onEnter = (event) => {
            const vx = gsap.utils.clamp(-40, 40, last?.vx ?? event.movementX ?? 0);
            const vy = gsap.utils.clamp(-40, 40, last?.vy ?? event.movementY ?? 0);
            gsap.fromTo(
              print,
              { x: vx * 0.9, y: vy * 0.9, rotation: PRINT_TILT + gsap.utils.clamp(-8, 8, vx * 0.22) },
              { x: 0, y: 0, rotation: PRINT_TILT, duration: 1.3, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' },
            );
          };
          window.addEventListener('pointermove', onMove, { passive: true });
          print.addEventListener('pointerenter', onEnter);
          return () => {
            window.removeEventListener('pointermove', onMove);
            print.removeEventListener('pointerenter', onEnter);
          };
        });
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} className="frames sheet sheet--rounded" aria-labelledby="frames-title">
      <div className="frames__viewport">
        <div className="frames__track">
          <header className="frames__intro">
            <SplitReveal as="h2" id="frames-title" className="frames__title">
              {frames.title}
            </SplitReveal>
            <Reveal as="p" className="frames__lede" delay={0.25}>
              {frames.intro}
            </Reveal>
          </header>

          {frames.items.map((item) => (
            <figure key={item.variant} className={`frame frame--${item.variant}`}>
              <div className="frame__mask">
                {item.variant === 'poster' && (
                  <span className="frame__numerals" aria-hidden="true">
                    {dateNumerals}
                  </span>
                )}
                <div className="frame__drift">
                  <img
                    className="frame__photo"
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {item.variant === 'print' && <span className="frame__print-caption">{item.caption}</span>}
              </div>
              <figcaption className="frame__caption">
                {item.variant === 'print' ? `The original photograph, untouched` : item.caption}
                {item.variant === 'poster' && <span className="frame__caption-date">{dateLabel}</span>}
              </figcaption>
            </figure>
          ))}

          <div className="frames__outro">
            <p className="frames__toast">{frames.outro}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
