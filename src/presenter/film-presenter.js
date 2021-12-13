import FilmCardView from './view/film-card-view.js';
import InfoPopupView from './view/info-popup-view.js';
import {RenderPosition, render} from './render.js';

export default class SingleCardPresenter {

  #cardListContainer = null;

  #filmCard = null;
  #filmPopup = null;

  #card = null;
  #comments = null;

  #siteMain = document.querySelector('.main');

  constructor(cardListContainer) {
    this.#cardListContainer = cardListContainer;
  }

  init = (card,comments) => {
    this.#card = card;
    this.#comments = comments;

    this.#filmCard = new FilmCardView(this.#card);
    this.#filmPopup = new InfoPopupView(this.#card, this.#comments);

    this.#filmCard.setOpenHandler(this.#handleOpenClick);
    this.#filmPopup.setCloseHandler(this.#handlePopupClose);

    render(this.#cardListContainer, this.#filmCard, RenderPosition.BEFORE_END);
  }


  //Открывает попап
  #openCurrentPopup = () => {
    render(this.#siteMain, this.#filmPopup, RenderPosition.BEFORE_END);
  };


  //DRY для попапа
  #erasePopup = () => {
    this.#siteMain.removeChild(this.#filmPopup);
    this.#siteMain.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };


  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#erasePopup(this.#onEscKeyDown);
    }
  };

  //Обработчик на карточку для открытия попапа
  #handleOpenClick = (() => {
    this.#openCurrentPopup();
    this.#siteMain.classList.add('hide-overflow');
    document.addEventListener('keydown',this.#onEscKeyDown);
  });

  //Для закрытия попапа
  #handlePopupClose = (() => {
    this.#erasePopup(this.#onEscKeyDown);
  });

}
