import MenuView from '../view/menu-view.js';
import SortButtonView from '../view/sort-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';

import { RenderPosition, render, remove} from '../render.js';
import { SortType } from '../view/helpers.js';
import {updateItemById, sortFilmsByDate, sortFilmsByRating} from '../utils.js';

import SingleCardPresenter from './film-presenter.js';

const CARDS_PER_STEP = 5;


export default class FilmsPresenter {

  #container = null;


  #sortComponent = new SortButtonView();
  #filmsSectionComponent = new FilmsSectionView();
  #emptyListComponent = new EmptyListView()
  #filmContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();


  #filmsPresenter = new Map();


  #renderedFilmCount = CARDS_PER_STEP;
  #films = [];
  #filters = [];
  #menuComponent = null;
  #sourcedFilms = [];
  #currentSortType = SortType.DEFAULT;


  constructor(container) {
    this.#container = container;
  }


  init = (films, filters) => {
    this.#films = [...films];
    this.#filters = [...filters];
    this.#sourcedFilms = [...films];

    this.#render();
  }


  //Отрисовка секции, карточек, меню и тд +  логика по отрисовке пустого листа
  #render = () => {
    if (this.#films.length === 0) {
      render(this.#filmsSectionComponent, this.#emptyListComponent, RenderPosition.BEFORE_END);
    } else {
      this.#renderFilmsFilters();
      this.#renderCards();
    }

    render(this.#container, this.#filmsSectionComponent, RenderPosition.BEFORE_END);
    render(this.#filmsSectionComponent, this.#filmContainerComponent, RenderPosition.BEFORE_END);

    this.#renderSort();
    this.#renderShowMoreButton();
  }


  #sortTasks = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortFilmsByRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    this.#clear();
    this.#renderCards();
    this.#renderShowMoreButton();
  }


  //Отрисовка сортировки
  #renderSort = () => {
    render(this.#container,this.#sortComponent, RenderPosition.BEFORE_BEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }


  // Отрисует одну карточку
  #renderCard = (film, comments) => {
    const presenter = new SingleCardPresenter(
      this.#filmContainerComponent,
      this.#handleFilmChange,
      this.#handleModeChange,
    );
    presenter.init(film, comments);
    this.#filmsPresenter.set(film.id, presenter);
  }

  // Отрисует первые 5 карточек
  #renderCards = () => {
    for (let i = 0; i < Math.min(this.#films.length, CARDS_PER_STEP); i++) {
      this.#renderCard(this.#films[i], this.#films[i].comments);
    }
  }

  //Очистит весь список
  #clear = () => {
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#renderedFilmCount = CARDS_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }


  // changeMode
  #handleModeChange = () => {
    this.#filmsPresenter.forEach((presenter) => presenter.resetView());
  }


  //Перерисовка фильма
  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItemById(this.#films, updatedFilm);
    this.#sourcedFilms = updateItemById(this.#sourcedFilms, updatedFilm);
    this.#filmsPresenter.get(updatedFilm.id).init(updatedFilm);
  }


  //Меню с фильтрами
  #renderFilmsFilters = () => {
    this.#menuComponent = new MenuView(this.#filters);
    render(this.#container, this.#menuComponent, RenderPosition.BEFORE_BEGIN);
  };


  //Отрисовка кнопки show more
  #renderShowMoreButton = () => {
    if(this.#films.length > CARDS_PER_STEP){
      render(this.#filmsSectionComponent, this.#showMoreButtonComponent, RenderPosition.BEFORE_END);

      this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClickHandler);
    }
  }


  //Обработчик кнопки show more
  #onShowMoreButtonClickHandler = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + CARDS_PER_STEP)
      .forEach((film) => this.#renderCard(film, film.comments));


    this.#renderedFilmCount += CARDS_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }
  }
}
