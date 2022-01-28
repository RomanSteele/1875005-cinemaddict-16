import {MINUTES_IN_HOUR} from './const.js';

const RANK_TITLES = [
  { watched: 21, title: 'Movie Buff' },
  { watched: 11, title: 'Fan' },
  { watched: 1, title: 'Novice' },
  { watched: 0, title: '' },
];

export const shiftDurationToHours = (timeInMinutes) => {
  const hours = Math.trunc(timeInMinutes/MINUTES_IN_HOUR);
  const minutes = timeInMinutes % MINUTES_IN_HOUR;
  return `${hours  }h ${  minutes  }m`;
};


export const getRankTitle = (count) => RANK_TITLES
  .find(({ watched }) => watched <= count)?.title ?? '';

