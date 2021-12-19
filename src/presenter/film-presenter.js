import FilmCardView from '../view/film-card-view.js';
import InfoPopupView from '../view/info-popup-view.js';
import { RenderPosition, render, remove, replace } from '../render.js';

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

  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }


  init = (film) => {

    this.#film = film;

    this.#renderFilm();

    this.#setAllHandlers();

  }

    destroy = () => {
      remove(this.#filmCard);
      remove(this.#filmPopup);
    }

    resetView = () => {

      if (this.#mode !== Mode.DEFAULT) {
        this.#destroyPopup();
      }
    }

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
  };

//Отрисует фильм, попап.
#renderFilm = () => {

  const prevFilmFilm = this.#filmCard;
  const prevFilmPopup = this.#filmPopup;

  this.#filmCard = new FilmCardView(this.#film);
  this.#filmPopup = new InfoPopupView(this.#film, this.#film.comments);

  if (prevFilmFilm === null ) {
    render(this.#container, this.#filmCard, RenderPosition.BEFORE_END);
    return;
  }

  if (this.#mode === Mode.DEFAULT) {
    replace(this.#filmCard, prevFilmFilm);
  }

  if (this.#mode === Mode.FULL) {
    replace(this.#filmCard, prevFilmFilm);
    replace(this.#filmPopup, prevFilmPopup);
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
    this.#destroyPopup();
    document.removeEventListener('keydown',this.#onEscKeyDown);
  };

  //Вотчлист
  #handleWatchlistClick = () => {
    this.#changeData({
      ...this.#film,
      inWatchlist: !this.#film.inWatchlist,
    });
  };


  //Просмотренное
  #handleWatchedClick = () => {
    const isWatched = !this.#film.isWatched;
    this.#changeData({
      ...this.#film,
      isWatched,
      watchingDate: isWatched ? new Date() : null,
    });
  };


  //Избранное
  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#film,
      isFavourite: !this.#film.isFavourite,
    });
  };


}
