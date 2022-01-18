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

export const watchedFilmsCountToUserRank = (count) => {
  let userRank = null;

  if (count >= 21) {
    userRank = 'Movie Buff';
  } else if (count >= 11 && count <= 20) {
    userRank = 'Fan';
  } else if (count >= 1 && count <= 10) {
    userRank = 'Novice';
  } else {
    userRank = '';
  }

  return userRank;
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorites',
};
