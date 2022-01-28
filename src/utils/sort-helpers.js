export const sortFilmsByDate = (previousFilm, currentFilm) =>  currentFilm.releaseDate - previousFilm.releaseDate;

export const sortFilmsByRating = (previousFilm, currentFilm) => currentFilm.rating - previousFilm.rating;

export const sortExtraListMostCommented = (previousFilm, currentFilm) => currentFilm.comments.length - previousFilm.comments.length;

export const sortExtraListTopRated = (previousFilm, currentFilm) => currentFilm.rating - previousFilm.rating;
