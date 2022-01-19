import {Rank, RankTypes} from './const.js';

const MINUTES_IN_HOURS = 60;

export const shiftDurationToHours = (timeInMinutes) => {
  const hours = Math.trunc(timeInMinutes/MINUTES_IN_HOURS);
  const minutes = timeInMinutes % MINUTES_IN_HOURS;
  return `${hours  }h ${  minutes  }m`;
};

export const shiftFilmsCountToUserRank = (count) => {

  let userRank = '';

  const { NOVICE, FAN, MOVIE_BUFF } = RankTypes;

  if (count >= NOVICE.min && count <= NOVICE.max) {
    userRank = Rank.NOVICE;
  } else if (count >= FAN.min && count <= FAN.max) {
    userRank = Rank.FAN;
  } else if (count>= MOVIE_BUFF.min) {
    userRank = Rank.MOVIE_BUFF;
  } else {
    userRank = '';
  }
  return userRank;
};

