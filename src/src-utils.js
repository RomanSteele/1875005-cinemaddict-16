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


export const sortByDate = (previousFilm, currentFilm) =>  currentFilm.release - previousFilm.release;

export const sortByRating = (previousFilm, currentFilm) => currentFilm.rating - previousFilm.rating;
