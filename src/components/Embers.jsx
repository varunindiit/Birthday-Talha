import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/gsap.js';

const random = (min, max) => min + Math.random() * (max - min);

// Slow sparks drifting up behind the celebration. The loop only runs while the
// canvas is on screen, and never under reduced motion.
export default function Embers({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (prefersReducedMotion()) return undefined;

    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let frame = 0;
    let sparks = [];

    const spawn = (anywhere) => ({
      x: random(0, width),
      y: anywhere ? random(0, height) : height + 10,
      radius: random(0.8, 2.6),
      speed: random(0.25, 0.9),
      sway: random(0, Math.PI * 2),
      swaySpeed: random(0.006, 0.02),
      alpha: random(0.25, 0.85),
      warm: Math.random() < 0.5,
    });

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(Math.min(64, Math.max(22, width / 24)));
      sparks = Array.from({ length: count }, () => spawn(true));
    };

    const tick = () => {
      context.clearRect(0, 0, width, height);
      sparks.forEach((spark, index) => {
        spark.y -= spark.speed;
        spark.sway += spark.swaySpeed;
        spark.x += Math.sin(spark.sway) * 0.35;
        if (spark.y < -10) sparks[index] = spawn(false);

        // Sparks fade out as they climb.
        const fade = Math.min(1, spark.y / (height * 0.6));
        context.globalAlpha = spark.alpha * fade;
        context.fillStyle = spark.warm ? '#ffb347' : '#ffe2a8';
        context.beginPath();
        context.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
        context.fill();
      });
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = entry.isIntersecting ? requestAnimationFrame(tick) : 0;
    });

    resize();
    observer.observe(canvas);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
