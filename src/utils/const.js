export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const COMMENT_EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

export const UserAction = {
  WATCHLIST_ADD: 'WATCHLIST_ACTION',
  WATCHED_ADD: 'WATCHED_ACTION',
  FAVORITE_ADD: 'FAVORITE_ACTION',
  COMMENT_ADD:'COMMENT_ADD',
  COMMENT_DELETE:'COMMENT_DELETE',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};


export const StatisticsItem = {
  STATISTICS: 'stats'
};

export const StatisticsType = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

export const Rank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const RankType = {
  NOVICE: {
    MIN: 1,
    MAX: 10,
  },
  FAN: {
    MIN: 11,
    MAX: 20,
  },
  MOVIE_BUFF: {
    MIN: 21,
  }
};

export const DesctiptionLettersQuantity = {
  SHORT: 139,
  LONG: 140,
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorites',
};

export const MINUTES_IN_HOUR = 60;
