import AbstractObservable from './abstract-observable.js';

export default class FilmsModel extends AbstractObservable {
#films = [];

set films(films) {
  this.#films = [...films];
}

get films() {
  return this.#films;
}

updateFilm = (updateType, update) => {
  const index = this.#films.findIndex((film) => film.id === update.id);

  if (index === -1) {
    return this.#films;
  }

  this.#films = [
    ...this.#films.slice(0, index),
    update,
    ...this.#films.slice(index + 1),
  ];

  this._notify(updateType, update);
}

  addFilmToList = (updateType, update) => {
    this.#films = [
      update,
      ...this.#films,
    ];

    this._notify(updateType, update);
  }

  deleteFilmFromList = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType);
  }
}


