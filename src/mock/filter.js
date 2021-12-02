// Массив для имён, которые вставляю в разметку
const filterNameToTitle = {
  all: 'All movies',
  watchlist: 'Watchlist',
  history: 'History',
  favourite: 'Favourite'
};

// Находит длины массивов
const filmToFilterMap = {
  watchlist: (films) => films.filter((film) => film.inWatchlist).length,
  history: (films) => films.filter((film) => film.isWatched).length,
  favourite: (films) => films.filter((film) => film.isFavourite).length,
};

//Генерирует данные для фильтра и разметки
export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    title: filterNameToTitle[filterName],
    count: countFilms(films),
  }),
);
