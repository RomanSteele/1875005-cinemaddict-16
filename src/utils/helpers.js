import {Rank, RankType, MINUTES_IN_HOUR} from './const.js';

export const shiftDurationToHours = (timeInMinutes) => {
  const hours = Math.trunc(timeInMinutes/MINUTES_IN_HOUR);
  const minutes = timeInMinutes % MINUTES_IN_HOUR;
  return `${hours  }h ${  minutes  }m`;
};

export const shiftFilmsCountToUserRank = (count) => {

  let userRank = '';

  const { NOVICE, FAN, MOVIE_BUFF } = RankType;

  if (count >= NOVICE.MIN && count <= NOVICE.MAX) {
    userRank = Rank.NOVICE;
  } else if (count >= FAN.MIN && count <= FAN.MAX) {
    userRank = Rank.FAN;
  } else if (count>= MOVIE_BUFF.MIN) {
    userRank = Rank.MOVIE_BUFF;
  } else {
    userRank = '';
  }
  return userRank;
};

