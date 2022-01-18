import FilmCardView from '../view/film-card-view.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';


const Mode = {
  DEFAULT: 'DEFAULT',
  FULL: 'FULL',
};


export default class SingleCardPresenter {

  #container = null;
  #changeData = null;
  #changeMode = null;

  #filmCard = null;

  #film = null;

  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }


  init = (film) => {

    this.#film = film;


    const prevFilmCard = this.#filmCard;
    this.#filmCard = new FilmCardView(this.#film);
    this.#filmCard.setClickHandler(this.#openPopup);
    this.#filmCard.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCard.setWatchedlistClickHandler(this.#handleWatchedClick);
    this.#filmCard.setFavoritelistClickHandler(this.#handleFavoriteClick);

    if (prevFilmCard === null ) {
      render(this.#container, this.#filmCard, RenderPosition.BEFORE_END);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCard, prevFilmCard);
    }

    if (this.#mode === Mode.FULL) {
      replace(this.#filmCard, prevFilmCard);
    }

    remove(prevFilmCard);

  }

    destroy = () => {
      remove(this.#filmCard);
    }


  #openPopup = () => {
    this.#changeMode(this.#film.id);
  };


  #handleWatchlistClick = () => {
    const inWatchlist = !this.#film.inWatchlist;
    this.#changeData(
      UserAction.WATCHLIST_ADD,
      UpdateType.PATCH,
      {...this.#film,
        inWatchlist,
      },);
  };


  #handleWatchedClick = () => {
    const isWatched = !this.#film.isWatched;
    this.#changeData(
      UserAction.WATCHED_ADD,
      UpdateType.PATCH,
      {...this.#film,
        isWatched,
        watchingDate: isWatched ? new Date() : null,
      },);
  };


  #handleFavoriteClick = () => {
    const isFavorite = !this.#film.isFavorite;
    this.#changeData(
      UserAction.FAVORITE_ADD,
      UpdateType.PATCH,
      {...this.#film,
        isFavorite,});
  };

}

