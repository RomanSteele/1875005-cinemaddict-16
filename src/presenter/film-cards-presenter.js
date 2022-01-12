import SortButtonView from '../view/sort-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';

import { RenderPosition, render, remove} from '../render.js';
import { SortType, FilterType } from '../view/helpers.js';
import { sortFilmsByDate, sortFilmsByRating} from '../utils.js';

import SingleCardPresenter from './film-presenter.js';
import {filters} from '../filters.js';
import {UserAction, UpdateType} from '../view/helpers.js';

const CARDS_PER_STEP = 5;


export default class FilmsPresenter {

  #container = null;
  #filterModel = null;
  #emptyListComponent = null;
  #filmsSectionComponent = null;
  #filmContainerComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;
  #filmsModel = null;
  #filmsPresenter = new Map();
  #commentsModel = null;

  #renderedFilmCount = CARDS_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #openedPopupData = {};
  #isErased = false;


  constructor(container, filmsModel, filterModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

  }


  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filters[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }
    return filteredFilms;
  }


  init = () => {

    this.#filmsSectionComponent = new FilmsSectionView();
    this.#filmContainerComponent = new FilmsContainerView();

    render(this.#container, this.#filmsSectionComponent, RenderPosition.BEFORE_END);
    render(this.#filmsSectionComponent, this.#filmContainerComponent, RenderPosition.BEFORE_END);
    this.#renderBoard();

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentModelEvent);

    this.#isErased = false;
  }


  erase = () => {

    this.#clearBoard();

    remove(this.#filmContainerComponent);
    remove(this.#filmsSectionComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleCommentModelEvent);

    this.#isErased = true;
  };


  //Отрисовка секции, карточек, меню и тд +  логика по отрисовке пустого листа
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  }


  //Отрисовка сортировки
  #renderSort = () => {
    this.#sortComponent = new SortButtonView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#container, this.#sortComponent, RenderPosition.BEFORE_BEGIN);
  }


  // Отрисует одну карточку
  #renderCard = (film) => {
    const presenter = new SingleCardPresenter(
      this.#filmContainerComponent,
      this.#handleViewAction,
      this.#handleModeChange,
    );

    const comments = [...this.#commentsModel.comments.filter((comment) => film.comments.includes(comment.id))];
    presenter.init(film, comments);
    if (this.#openedPopupData && this.#openedPopupData.id === film.id) {
      presenter.restorePopup(this.#openedPopupData);
    }
    this.#filmsPresenter.set(film.id, presenter);
  }


  #renderCards = (films) => {
    films.forEach((film)=> this.#renderCard(film));
  }


  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterType);
    render(this.#filmsSectionComponent, this.#emptyListComponent, RenderPosition.BEFORE_END);
  }


  // changeMode
  #handleModeChange = () => {
    this.#openedPopupData = {};
    this.#filmsPresenter.forEach((presenter) => presenter.resetView());
  }


  #handleViewAction = (actionType, updateType, update, openedPopupData) => {
    this.#openedPopupData = openedPopupData;
    switch (actionType) {
      case UserAction.WATCHLIST_ACTION:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.WATCHED_ACTION:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.FAVORITE_ACTION:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.COMMENT_ADD:
        this.#commentsModel.addComment(actionType,  update);
        break;
      case UserAction.COMMENT_DELETE:
        this.#commentsModel.deleteComment(actionType, update);
        break;
    }
  }


  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmsPresenter.get(data.id).init(data, data.comments);
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.MAJOR:
        if (this.#isErased === true) {
          this.init();
          return;
        }
        this.#clearBoard({resetRenderedFilmCount: true , resetSortType: true});
        this.#renderBoard();


        break;
    }
  }


  #handleCommentModelEvent = (actionType, update) => {
    const currentFilm = this.#filmsModel.films.find((film) => film.id  === this.#openedPopupData.id);
    let index = null;
    let comments  = null;

    switch (actionType) {

      case UserAction.COMMENT_ADD:
        delete this.#openedPopupData.comment;
        delete this.#openedPopupData.emotion;
        this.#filmsModel.updateFilm(UpdateType.MINOR, { ...currentFilm, comments: [...currentFilm.comments, update] });
        break;

      case UserAction.COMMENT_DELETE:
        index = [...currentFilm.comments].findIndex((comment) => comment.id === update);
        comments  = [...currentFilm.comments.slice(0, index), ...currentFilm.comments.slice(index + 1)];
        this.#filmsModel.updateFilm(UpdateType.MINOR, { ...currentFilm, comments });
        break;

    }
  };


  //Отрисовка кнопки show more
  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    if(this.films.length > CARDS_PER_STEP){
      this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClickHandler);

      render(this.#filmsSectionComponent, this.#showMoreButtonComponent, RenderPosition.BEFORE_END);
    }
  }


  //Обработчик кнопки show more
  #onShowMoreButtonClickHandler = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + CARDS_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    films.forEach((film) => this.#renderCard(film, film.comments));
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  }


  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = CARDS_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }


  #renderBoard = () =>{
    const films = this.films;
    const filmsCount = films.length;
    if (filmsCount === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();

    this.#renderCards(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }

  }
}

