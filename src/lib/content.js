import cutout from '../assets/photos/talha-cutout.webp';

// All copy and photos live here so the page can be re-worded, or given
// more photographs, without touching a component.

export const person = 'Talha';
export const sender = 'Indiit Solutions';
export const dateLabel = '6 October 2026';

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
