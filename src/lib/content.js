import cutout from '../assets/photos/talha-cutout.webp';
import close from '../assets/photos/talha-close.webp';
import original from '../assets/photos/talha-original.webp';

// All copy and photos live here so the page can be re-worded, or given
// more photographs, without touching a component.

export const person = 'Talha';
export const sender = 'Indiit Solutions';
export const dateLabel = '6 October 2026';
export const dateNumerals = '06.10';

export const hero = {
  greeting: 'Happy birthday,',
  lede: `A special wish from all of us at ${sender}.`,
  portrait: { src: cutout, width: 1145, height: 1188 },
};

export const letter = {
  salutation: `Dear ${person},`,
  paragraphs: [
    'Some people are simply good to work with. You are one of them. You bring clear thinking, honest feedback and a steady kind of trust that makes everyone around the table do better work.',
    'Today has nothing to do with timelines or deliverables. It is about you. We hope the day is unhurried, that the people you love are close, and that someone else is taking care of the cake.',
    'Thank you for letting us build alongside you. May the year ahead bring good health, real joy, and every success you are working towards.',
  ],
  closing: 'With warmth and respect,',
  signature: `Everyone at ${sender}`,
};

export const frames = {
  title: 'One photograph was all we had. It turned out to be all we needed.',
  intro: 'So we gave it the gallery treatment. Three frames, one man of the hour.',
  outro: 'Here’s to every frame still to come.',
  // Add more photographs here; each variant has its own framing in Frames.css.
  items: [
    {
      variant: 'poster',
      src: cutout,
      width: 1145,
      height: 1188,
      alt: `${person} in a black knitted jumper, looking off to one side`,
      caption: 'Today’s headliner',
    },
    {
      variant: 'arch',
      src: close,
      width: 700,
      height: 910,
      alt: `A closer portrait of ${person}`,
      caption: 'Same man, warmer light',
    },
    {
      variant: 'print',
      src: original,
      width: 880,
      height: 1100,
      alt: `${person} in the original photograph`,
      caption: `${person}, exactly as he is`,
    },
  ],
};

export const celebration = {
  title: `Make a wish, ${person}.`,
  before: 'One candle, on us. All it needs is you.',
  after: 'There it is. May this year bring everything you are building towards.',
  light: 'Light the candle',
  again: 'Celebrate again',
  status: `The candle is lit. Happy birthday, ${person}.`,
  days: 365,
  daysLabel: 'new days, starting today. Every one of them is yours.',
};

export const finale = {
  wish: `Wishing you a wonderful birthday, ${person}.`,
  from: `From everyone at ${sender}.`,
  replay: 'Watch it again',
};
