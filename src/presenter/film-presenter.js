import FilmCardView from '../view/film-card-view.js';
import InfoPopupView from '../view/info-popup-view.js';
import { RenderPosition, render, remove, replace } from '../render.js';
import {UserAction, UpdateType} from '../view/helpers.js';


const Mode = {
  DEFAULT: 'DEFAULT',
  FULL: 'FULL',
};


//Перезентер одного фильма
export default class SingleCardPresenter {

  #container = null;
  #changeData = null;
  #changeMode = null;

  #filmCard = null;
  #filmPopup = null;

  #film = null;
  #comments = null;

  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
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
      document.addEventListener('keydown',this.#onEscKeyDown);

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

  const prevFilmFilm = this.#filmCard;
  const prevFilmPopup = this.#filmPopup;

  this.#filmCard = new FilmCardView(this.#film);
  this.#filmPopup = new InfoPopupView(this.#film, this.#comments);

  if (prevFilmFilm === null ) {
    render(this.#container, this.#filmCard, RenderPosition.BEFORE_END);
    return;
  }

  if (this.#mode === Mode.DEFAULT) {
    replace(this.#filmCard, prevFilmFilm);
  }

  if (this.#mode === Mode.FULL) {
    replace(this.#filmCard, prevFilmFilm);
    this.#filmPopup.updateData({ ...this.#film, comments: this.#comments });
  }

  remove(prevFilmFilm);
  remove(prevFilmPopup);
}


//Убирает попап
  #destroyPopup = () => {
    this.#filmPopup.element.remove();
    document.body.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
  }


  //Отрисовывает попап
  #openPopup = () => {
    this.#changeMode();
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
       document.removeEventListener('keydown',this.#onEscKeyDown);
     }
   };


   //Обработчик откр
  #handleFilmCardClick = () => {
    this.#openPopup();
    document.addEventListener('keydown',this.#onEscKeyDown);
  };


  //Обработчик закр
  #handleCloseButtonClick = () => {
    this.#filmPopup.restore(this.#film);
    this.#destroyPopup();
    document.removeEventListener('keydown',this.#onEscKeyDown);
  };

  //Вотчлист
  #handleWatchlistClick = () => {
    const currentFilter = document.querySelector('.main-navigation__item--active').textContent;
    const inWatchlist = !this.#film.inWatchlist;
    this.#changeData(
      UserAction.WATCHLIST_ACTION,
      UpdateType.MINOR,
      {...this.#film,
        inWatchlist,
      },
      (this.#mode === Mode.FULL) && this.#filmPopup.state);

    if(this.#mode === Mode.FULL  && currentFilter.includes ('Watchlist') === true && inWatchlist === false) {
      this.#destroyPopup();
    }
  };


  //Просмотренное
  #handleWatchedClick = () => {
    const currentFilter = document.querySelector('.main-navigation__item--active').textContent;
    const isWatched = !this.#film.isWatched;
    this.#changeData(
      UserAction.WATCHED_ACTION,
      UpdateType.MINOR,
      {...this.#film,
        isWatched,
        watchingDate: isWatched ? new Date() : null,
      },
      (this.#mode === Mode.FULL) && this.#filmPopup.state);

    if(this.#mode === Mode.FULL  && currentFilter.includes ('History') === true && isWatched === false) {
      this.#destroyPopup();
    }
  };


  //Избранное
  #handleFavoriteClick = () => {
    const currentFilter = document.querySelector('.main-navigation__item--active').textContent;
    const isFavorite = !this.#film.isFavorite;
    this.#changeData(
      UserAction.FAVORITE_ACTION,
      UpdateType.MINOR,
      {...this.#film,
        isFavorite,
      },(this.#mode === Mode.FULL) && this.#filmPopup.state);
    if(this.#mode === Mode.FULL  && currentFilter.includes ('Favorite') === true && isFavorite === false) {
      this.#destroyPopup();
    }
  };


  //Добавление комментария
  #handleCommentAdd = (comment) => {
    const newComment = { ...this.#comments, ...comment };
    this.#changeData(
      UserAction.COMMENT_ADD,
      UpdateType.MINOR,
      newComment,
      (this.#mode === Mode.FULL) && this.#filmPopup.state);
    this.#filmPopup.restore(this.#film);
  };

#handleCommentDelete = (comment) => {
  this.#changeData(
    UserAction.COMMENT_DELETE,
    UpdateType.MINOR,
    comment,
    (this.#mode === Mode.FULL)  && this.#filmPopup.state,
  );
}
}

