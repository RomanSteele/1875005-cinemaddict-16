const MINUTES_IN_HOURS = 60;

export const shiftDurationToHours = (timeInMinutes) => {
  const hours = Math.trunc(timeInMinutes/MINUTES_IN_HOURS);
  const minutes = timeInMinutes % MINUTES_IN_HOURS;
  return `${hours  }h ${  minutes  }m`;
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const COMMENTS_EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

export const UserAction = {
  WATCHLIST_ACTION: 'WATCHLIST_ACTION',
  WATCHED_ACTION: 'WATCHED_ACTION',
  FAVORITE_ACTION: 'FAVORITE_ACTION',
  COMMENT_ADD:'COMMENT_ADD',
  COMMENT_DELETE:'COMMENT_DELETE',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorites',
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
