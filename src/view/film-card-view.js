import {shiftDurationToHours} from './utils.js';
import {createElement} from '../render.js';


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

export default class FilmCardView {
  #element = null;
  #card = null;

  constructor(card) {
    this.#card = card;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmCardTemplate(this.#card);
  }

  removeElement() {
    this.#element = null;
  }
}
