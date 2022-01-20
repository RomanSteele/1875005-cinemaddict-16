import AbstractObservable from './abstract-observable.js';
import {UpdateType} from '../utils/const.js';
import dayjs from 'dayjs';

export default class FilmsModel extends AbstractObservable {
#apiService = null;
#films = [];

constructor(apiService) {
  super();
  this.#apiService = apiService;
}
/*
set films(films) {
  this.#films = [...films];
}
*/

get films() {
  return this.#films;
}


init = async () => {
  try {
    const films = await this.#apiService.films;
    this.#films = films.map(this.#adaptToClient);
  } catch(err) {
    this.#films = [];
  }

  this._notify(UpdateType.INIT);
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

  addFilm = (updateType, update) => {
    this.#films = [
      update,
      ...this.#films,
    ];

    this._notify(updateType, update);
  }

  deleteFilm = (updateType, update) => {
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

  #adaptToClient = (film) => {
    const adaptedFilm = {
      id: film.id,
      title: film['film_info'].title,
      alternativeTitle: film['film_info']['alternative_title'],
      rating: film['film_info']['total_rating'],
      imgSource: film['film_info'].poster,
      ageRating: film['film_info']['age_rating'],
      director: film['film_info'].director,
      writers: film['film_info'].writers,
      actors: film['film_info'].actors,
      releaseDate: film['film_info'].release.date !== null ? dayjs(film['film_info'].release.date) : film['film_info'].release.date,
      releaseCountry: film['film_info'].release['release_country'],
      duration: film['film_info'].runtime,
      genres: film['film_info'].genre,
      description: film['film_info'].description,
      comments: film.comments,
      inWatchlist: film['user_details'].watchlist,
      isWatched: film['user_details']['already_watched'],
      watchingDate: new Date(film['user_details']['watching_date']),
      isFavorite: film['user_details'].favorite,
    };
    console.log(adaptedFilm);
    return adaptedFilm;
  }
}

