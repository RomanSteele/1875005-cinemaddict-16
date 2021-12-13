import ProfileRatingView from './view/profile-rating-view.js';
import MenuView from './view/menu-view.js';
import SortButtonView from './view/sort-button-view.js';
import FilmsView from './view/films-view.js';
import FilmsSectionView from './view/films-section-view.js';
import FilmsContainerView from './view/films-container-view.js';
import FilmCardView from './view/film-card-view.js';
import InfoPopupView from './view/info-popup-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import EmptyListView from './view/empty-list-view.js';

import SingleCardPresenter from'./film-presenter.js';

import {RenderPosition, render} from './render.js';

const FIRST_FIVE_CARDS_COUNT = 5;
const CARDS_PER_STEP = 5;


export default class FilmsPresenter {

  #filmsBoard = null;

  //#profileRatingComponent = new ProfileRatingView();
  //#menuComponent = new MenuView();
  //#sortComponent = new SortButtonView();
  #filmsComponent = new FilmsView();
  #filmsSectionComponent = new FilmsSectionView();
  #emptyListComponent = new EmptyListView()
  #filmContainerComponent = new FilmsContainerView();

  #films = [];


  constructor(filmsBoard) {
    this.#filmsBoard = filmsBoard;
  }


  init = (films) => {
    this.#films = [...films];

    render(this.#filmsBoard, this.#filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this.#filmsSectionComponent, this.#filmContainerComponent, RenderPosition.BEFOREEND);

    this.#renderCards();
  }

/*
//Отрисовка сортировки
  #renderSort = () => {

  }
*/

//Отрисовка карточки
#renderCard = (task) => {
const cardPresenter = new SingleCardPresenter(this.#filmContainerComponent);
cardPresenter.init(task);
}


//Отрисовка 5 первых карточек
  #renderCards = () => {
    for (let i = 0; i < Math.min(this.#filmCards.length, FIRST_FIVE_CARDS_COUNT); i++) {
      this.#renderCard();
    }
  }


//Отрисавка заглушки
  #renderNoTasks = () => {

if (this.#filmCards.length > 0) {
  render(this.#filmsComponent, this.#filmsSectionComponent, RenderPosition.BEFORE_END);
} else {
  render(this.#filmsComponent, new EmptyListView().element, RenderPosition.BEFORE_END);
  siteMain.removeChild(sortSection.element);
}
  }


//Отрисовка кнопки showmore
  #renderShowMoreButton = () => {

    const showMoreButtonView = new ShowMoreButtonView();

    if (this.#filmCards.length > CARDS_PER_STEP) {
      let renderedCardsCount = CARDS_PER_STEP;
      render(filmSection.element, showMoreButtonView.element, RenderPosition.BEFORE_END);

      showMoreButtonView.setClickHandler(() => {
        this.#filmCards
          .slice(renderedCardsCount, renderedCardsCount + CARDS_PER_STEP)
          .forEach((card) => renderFilmCard(containerSection.element, card, card.comments));


        renderedCardsCount += CARDS_PER_STEP;

        if (renderedCardsCount >= this.#filmCards.length) {
          showMoreButtonView.element.remove();
        }
      });
    }
  }

}
