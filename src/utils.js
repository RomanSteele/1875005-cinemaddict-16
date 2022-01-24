export const updateItemById = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};


export const sortFilmsByDate = (previousFilm, currentFilm) =>  currentFilm.releaseDate - previousFilm.releaseDate;

export const sortFilmsByRating = (previousFilm, currentFilm) => currentFilm.rating - previousFilm.rating;

export const sortExtraList = (field) => (b, a) => a[field] > b[field] ? 1 : -1;
