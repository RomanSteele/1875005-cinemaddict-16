import FilmCardView from '../view/film-card-view.js';
import InfoPopupView from '../view/info-popup-view.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/helpers.js';

import { generateComment } from '../mock/comment.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  FULL: 'FULL',
};


//Перезентер одного фильма
export default class SingleCardPresenter {

  #container = null;
  #changeData = null;
  //#changeMode = null;

  #filmCard = null;
  #filmPopup = null;

  #film = null;
  #comments = null;

  #mode = Mode.DEFAULT;

  constructor(container, changeData, /*changeMode*/) {
    this.#container = container;
    this.#changeData = changeData;
    //this.#changeMode = changeMode;
  }


  init = (film, comments) => {

    this.#film = film;

    this.#comments = comments;

    this.#renderFilm();

    this.#setAllHandlers();

  }

    destroy = () => {
      remove(this.#filmCard);
      remove(this.#filmPopup);
    }

    resetView = () => {
      if (this.#mode === Mode.FULL) {
        this.#filmPopup.restore(this.#film);
        this.#destroyPopup();
      }
    }

    restorePopup = (state) => {
      this.#filmPopup.restore({...state, ...this.#film});
      this.#openPopup();
      this.#filmPopup.restoreScrollPosition();
    };


    //Навесит все обработчики
  #setAllHandlers = () => {
    this.#filmCard.setClickHandler(this.#handleFilmCardClick);
    this.#filmCard.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCard.setWatchedlistClickHandler(this.#handleWatchedClick);
    this.#filmCard.setFavoritelistClickHandler(this.#handleFavoriteClick);

    this.#filmPopup.setClosePopupHandler(this.#handleCloseButtonClick);
    this.#filmPopup.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopup.setWatchedlistClickHandler(this.#handleWatchedClick);
    this.#filmPopup.setFavoritelistClickHandler(this.#handleFavoriteClick);
    this.#filmPopup.setCommentAddHandler(this.#handleCommentAdd);
    this.#filmPopup.setCommentDeleteHandler(this.#handleCommentDelete);
  };


//Отрисует фильм, попап.
#renderFilm = () => {

  const prevFilmCard = this.#filmCard;
  const prevFilmPopup = this.#filmPopup;

  this.#filmCard = new FilmCardView(this.#film);
  this.#filmPopup = new InfoPopupView(this.#film, this.#comments);

  if (prevFilmCard === null ) {
    render(this.#container, this.#filmCard, RenderPosition.BEFORE_END);
    return;
  }

  if (this.#mode === Mode.DEFAULT) {
    replace(this.#filmCard, prevFilmCard);
  }

  if (this.#mode === Mode.FULL) {
    replace(this.#filmCard, prevFilmCard);
    this.#filmPopup.updateData({ ...this.#film, comments: this.#comments });
  }

  remove(prevFilmCard);
  remove(prevFilmPopup);
}


//Убирает попап
  #destroyPopup = () => {
    this.#filmPopup.element.remove();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
  }


  //Отрисовывает попап
  #openPopup = () => {
    //this.#changeMode();
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.add('hide-overflow');
    render(document.body, this.#filmPopup, RenderPosition.BEFORE_END);
    this.#mode = Mode.FULL;
  };


  //Escape
   #onEscKeyDown = (evt) => {
     if (evt.key === 'Escape' || evt.key === 'Esc') {
       evt.preventDefault();
       this.#filmPopup.restore(this.#film);
       this.#destroyPopup();
     }
   };


   //Обработчик откр
  #handleFilmCardClick = () => {
    this.#openPopup();
  };


  //Обработчик закр
  #handleCloseButtonClick = () => {
    this.#filmPopup.restore(this.#film);
    this.#destroyPopup();
  };


  //Вотчлист
  #handleWatchlistClick = () => {
    const inWatchlist = !this.#film.inWatchlist;
    this.#changeData(
      UserAction.WATCHLIST_ADD,
      UpdateType.PATCH,
      {...this.#film,
        inWatchlist,
      },
      (this.#mode === Mode.FULL) && this.#filmPopup.state);
    if(this.#mode === Mode.FULL) {this.restorePopup();}
  };


  //Просмотренное
  #handleWatchedClick = () => {
    const isWatched = !this.#film.isWatched;
    this.#changeData(
      UserAction.WATCHED_ADD,
      UpdateType.PATCH,
      {...this.#film,
        isWatched,
        watchingDate: isWatched ? new Date() : null,
      },
      (this.#mode === Mode.FULL) && this.#filmPopup.state);
    if(this.#mode === Mode.FULL) {this.restorePopup();}
  };


  //Избранное
  #handleFavoriteClick = () => {
    const isFavorite = !this.#film.isFavorite;
    this.#changeData(
      UserAction.FAVORITE_ADD,
      UpdateType.PATCH,
      {...this.#film,
        isFavorite,
      },(this.#mode === Mode.FULL) && this.#filmPopup.state);
    if(this.#mode === Mode.FULL) {this.restorePopup();}
  };


  #handleCommentAdd = (comment) => {
    const newComment = { ...generateComment(Math.random()), ...comment};
    this.#changeData(
      UserAction.COMMENT_ADD,
      UpdateType.PATCH,
      newComment,
      (this.#mode === Mode.FULL) && this.#filmPopup.state);
    this.#filmPopup.restore(this.#film);
    document.removeEventListener('keydown',this.#onEscKeyDown);
  };


#handleCommentDelete = (comment) => {
  this.#changeData(
    UserAction.COMMENT_DELETE,
    UpdateType.PATCH,
    comment,
    (this.#mode === Mode.FULL)  && this.#filmPopup.state,
  );
  document.removeEventListener('keydown',this.#onEscKeyDown);
}
}

