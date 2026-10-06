// A small canvas confetti engine: paper slivers and dots in the page's own
// palette, with drag, gravity and a slow tumble. Runs only while pieces are alive.

const COLORS = ['#f3e3c3', '#ffb347', '#ff6a3d', '#ffe2a8', '#e8a7a0', '#fff6e0'];

const random = (min, max) => min + Math.random() * (max - min);

// Segments drawn per streamer; enough for a smooth curl at this size.
const RIBBON_STEPS = 10;

export function createConfetti(canvas) {
  const context = canvas.getContext('2d');
  let pieces = [];
  let frame = 0;
  let width = 0;
  let height = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function tick() {
    context.clearRect(0, 0, width, height);

    pieces = pieces.filter((piece) => piece.life > 0 && piece.y < height + 40);
    for (const piece of pieces) {
      piece.vx *= piece.drag;
      piece.vy = piece.vy * piece.drag + piece.gravity;
      piece.x += piece.vx + Math.sin(piece.sway) * 0.6;
      piece.y += piece.vy;
      piece.sway += piece.swaySpeed;
      piece.spin += piece.spinSpeed;
      piece.flip += piece.flipSpeed;
      piece.life -= 1;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.spin);
      context.globalAlpha = Math.min(1, piece.life / 40);
      context.fillStyle = piece.color;
      if (piece.ribbon) {
        // A curl of streamer: a short wave that ripples along its length as it falls.
        context.strokeStyle = piece.color;
        context.lineWidth = piece.size * 0.2;
        context.lineCap = 'round';
        context.beginPath();
        for (let step = 0; step <= RIBBON_STEPS; step += 1) {
          const along = step / RIBBON_STEPS;
          context.lineTo(
            (along - 0.5) * piece.size * 3.4,
            Math.sin(along * Math.PI * 2.5 + piece.flip) * piece.size * 0.36,
          );
        }
        context.stroke();
      } else if (piece.round) {
        context.beginPath();
        context.arc(0, 0, piece.size * 0.32, 0, Math.PI * 2);
        context.fill();
      } else {
        // Squashing the height fakes a sliver of paper turning over in the air.
        const turn = Math.cos(piece.flip);
        context.fillRect(-piece.size * 0.2, (-piece.size / 2) * turn, piece.size * 0.4, piece.size * turn);
      }
      context.restore();
    }

    frame = pieces.length ? requestAnimationFrame(tick) : 0;
    if (!frame) context.clearRect(0, 0, width, height);
  }

  // Throws `count` pieces from (x, y) in a cone around `angle` (radians, -π/2 is straight up).
  // `ribbons` is the share of pieces (0–1) thrown as streamers instead of paper;
  // `gravity` below 1 lets them hang in the air and drift down more slowly.
  function burst({
    x,
    y,
    count = 110,
    angle = -Math.PI / 2,
    spread = Math.PI * 0.75,
    power = 17,
    ribbons = 0,
    gravity = 1,
  }) {
    if (!width) resize();
    for (let i = 0; i < count; i += 1) {
      const direction = angle + random(-spread / 2, spread / 2);
      const speed = power * random(0.35, 1);
      const ribbon = Math.random() < ribbons;
      pieces.push({
        x,
        y,
        vx: Math.cos(direction) * speed,
        vy: Math.sin(direction) * speed,
        drag: random(0.955, 0.975),
        gravity: random(0.16, 0.3) * gravity,
        size: random(7, 15),
        ribbon,
        round: Math.random() < 0.22,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        spin: random(0, Math.PI * 2),
        spinSpeed: ribbon ? random(-0.04, 0.04) : random(-0.12, 0.12),
        flip: random(0, Math.PI * 2),
        flipSpeed: random(0.08, 0.22),
        sway: random(0, Math.PI * 2),
        swaySpeed: random(0.03, 0.08),
        life: random(170, 280),
      });
    }
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function destroy() {
    cancelAnimationFrame(frame);
    frame = 0;
    pieces = [];
    window.removeEventListener('resize', resize);
  }

  window.addEventListener('resize', resize);
  resize();

  return { burst, destroy };
}
