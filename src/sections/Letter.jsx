import { useRef } from 'react';
import Reveal from '../components/Reveal.jsx';
import ScrubWords from '../components/ScrubWords.jsx';
import SplitReveal from '../components/SplitReveal.jsx';
import { dateLabel, letter, sender } from '../lib/content.js';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap.js';
import './Letter.css';

// Scene two. The message, inked in at the reader's own scrolling pace.
export default function Letter() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // The signature is underlined by hand once it arrives.
      gsap.from('.letter__flourish path', {
        strokeDashoffset: 1,
        duration: 1.6,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.letter__sign', start: 'top 80%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="letter" className="letter sheet" data-tone="light" aria-labelledby="letter-title">
      <div className="letter__inner">
        <div className="letter__aside">
          <SplitReveal as="h2" id="letter-title" className="letter__salutation">
            {letter.salutation}
          </SplitReveal>
          <Reveal as="p" className="letter__meta" delay={0.3}>
            A letter from {sender}.
          </Reveal>
        </div>

        <div className="letter__body">
          {letter.paragraphs.map((paragraph) => (
            <ScrubWords key={paragraph} className="letter__paragraph">
              {paragraph}
            </ScrubWords>
          ))}

          <div className="letter__sign">
            <Reveal as="p" className="letter__closing">
              {letter.closing}
            </Reveal>
            <SplitReveal as="p" className="letter__signature" delay={0.15}>
              {letter.signature}
            </SplitReveal>
            <svg className="letter__flourish" viewBox="0 0 420 28" fill="none" aria-hidden="true" preserveAspectRatio="none">
              <path
                d="M4 18c58-11 118-14 176-9 44 4 70 14 112 13 44-1 82-10 124-16"
                pathLength="1"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
