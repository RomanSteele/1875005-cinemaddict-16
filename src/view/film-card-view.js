import {shiftDurationToHours} from './utils.js';
import AbstractView from './abstract-view.js';


const createControlButtonTemplate = (name, title, isActive) => {
  const activeClass = isActive ? 'film-card__controls-item--active' : '';
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${name} ${activeClass}">
      ${title}
    </button>`
  );
};


const createFilmCardTemplate = (film) => {

  const {
    title,
    rating,
    release,
    duration,
    genres,
    imgSource,
    alternativeTitle,
    description,
    comments,
    inWatchlist,
    isWatched,
    isFavourite,
  } = film;

  return`<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${release.format('YYYY')}</span>
              <span class="film-card__duration">${shiftDurationToHours(duration)}</span>
              <span class="film-card__genre">${genres[0]}</span>
            </p>
            <img src="./${imgSource}" alt="${alternativeTitle}" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
          ${createControlButtonTemplate('add-to-watchlist', 'Add to watchlist', inWatchlist )}
          ${createControlButtonTemplate('mark-as-watched', 'Mark as watched', isWatched)}
          ${createControlButtonTemplate('favorite', 'Mark as favorite', isFavourite)}
          </div>
  </article>
  `;
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  //для клика

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#onLinkClick);
  }

  #onLinkClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  //Вотчлист

  setWatchlistClickHandler = (callback) => {
    this._callback.clickWatchlist = callback;

    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#onAddToWatchlistClick);
  }

  #onAddToWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.clickWatchlist();
  }

  //Просмотренное

  setWatchedlistClickHandler = (callback) => {
    this._callback.clickWatchedList = callback;

    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#onAddToWatchedlistClick);
  }

  #onAddToWatchedlistClick = (evt) => {
    evt.preventDefault();
    this._callback.clickWatchedList();
  }

  //Избранное

  setFavoritelistClickHandler = (callback) => {
    this._callback.clickFavoriteList = callback;

    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#onAddToFavoritelistClick);
  }

  #onAddToFavoritelistClick = (evt) => {
    evt.preventDefault();
    this._callback.clickFavoriteList();
  }

}
