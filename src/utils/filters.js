import {FilterType, UserAction} from '../utils/helpers.js';


export const filterTypeToFilms  = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.inWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.isFavorite),
};

export const actionTypeToFilterType = {
  [UserAction.WATCHED_ADD]: FilterType.HISTORY,
  [UserAction.WATCHLIST_ADD]: FilterType.WATCHLIST,
  [UserAction.FAVORITE_ADD]: FilterType.FAVORITE,
};
