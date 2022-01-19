import SortButtonView from '../view/sort-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';


import {RenderPosition, render, remove} from '../utils/render.js';
import { sortFilmsByDate, sortFilmsByRating} from '../utils.js';

import SingleCardPresenter from './film-presenter.js';
import {filterTypeToFilms, actionTypeToFilterType } from '../utils/filters.js';
import {SortType, UserAction, UpdateType} from '../utils/const.js';

import FilmPopupPresenter from './popup-presenter.js';


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

  #popupPresenter = null;


  #renderedFilmCount = CARDS_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #isErased = false;


  constructor(container, filmsModel, filterModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

  }


  get films() {
    const films = this.#filmsModel.films;
    const filteredFilms = filterTypeToFilms [this.#filterModel.filter](films);

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

    this.#renderBoard();
    render(this.#filmsSectionComponent, this.#filmContainerComponent, RenderPosition.AFTER_BEGIN);
    render(this.#container, this.#filmsSectionComponent, RenderPosition.BEFORE_END);

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


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  }


  #renderSort = () => {
    this.#sortComponent = new SortButtonView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#container, this.#sortComponent, RenderPosition.BEFORE_BEGIN);
  }


  #renderCard = (film) => {
    const presenter = new SingleCardPresenter(
      this.#filmContainerComponent,
      this.#handleViewAction,
      this.#handleModeChange,
    );

    const comments = [this.#commentsModel.comments.filter((comment) => film.comments.includes(comment.id))];
    presenter.init(film, comments);
    this.#filmsPresenter.set(film.id, presenter);
  }


  #renderCards = (films) => {
    films.forEach((film)=> this.#renderCard(film));
  }


  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterModel.filter);
    render(this.#filmsSectionComponent, this.#emptyListComponent, RenderPosition.BEFORE_END);
  }


  #renderPopup = (filmId) => {

    const film = this.#filmsModel.films.find((filmItem) => filmId === filmItem.id);

    if (this.#popupPresenter && this.#popupPresenter.film.id !== filmId) {
      this.#popupPresenter.resetView();
    }

    this.#popupPresenter = new FilmPopupPresenter(this.#handleViewAction, this.#handleModeChange);

    const comments = [this.#commentsModel.comments.filter((comment) => film.comments.includes(comment.id))];
    this.#popupPresenter.init(film, comments);

  }


  #initPopup = () => {
    if (this.#popupPresenter) {
      const filmId = this.#popupPresenter.film.id;
      const film = this.#filmsModel.films.find((filmItem) => filmId === filmItem.id);

      const comments = this.#commentsModel.comments.filter((comment) => film.comments.includes(comment.id));
      this.#popupPresenter.init(film, comments);
    }
  };


  #handleModeChange = (filmId) => {
    this.#renderPopup(filmId);
  }


  #handleViewAction = (actionType, updateType, update) => {

    switch (actionType) {

      case UserAction.WATCHLIST_ADD:
        if(this.#filterModel.filter === actionTypeToFilterType[actionType]) {
          updateType = UpdateType.MINOR;
        }
        this.#filmsModel.updateFilm(updateType, update);
        break;

      case UserAction.WATCHED_ADD:
        if(this.#filterModel.filter === actionTypeToFilterType[actionType]) {
          updateType = UpdateType.MINOR;
        }
        this.#filmsModel.updateFilm(updateType, update);
        break;

      case UserAction.FAVORITE_ADD:
        if(this.#filterModel.filter === actionTypeToFilterType[actionType]) {
          updateType = UpdateType.MINOR;
        }
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
        this.#initPopup();
        break;

      case UpdateType.MAJOR:
        if (this.#isErased) {
          this.init();
          return;
        }
        this.#clearBoard({resetRenderedFilmCount: true , resetSortType: true});
        this.#renderBoard();


        break;
    }

  }


  #handleCommentModelEvent = (actionType, update) => {
    const currentFilm = this.#filmsModel.films.find((film) => film.id  === this.#popupPresenter.film.id);
    let indexes = null;
    let comments  = null;

    switch (actionType) {

      case UserAction.COMMENT_ADD:
        this.#filmsModel.updateFilm(UpdateType.MINOR, { ...currentFilm, comments: [...currentFilm.comments, update] });
        break;

      case UserAction.COMMENT_DELETE:
        indexes = [...currentFilm.comments].findIndex((comment) => comment.id === update);
        comments  = [...currentFilm.comments.slice(0, indexes), ...currentFilm.comments.slice(indexes + 1)];
        this.#filmsModel.updateFilm(UpdateType.MINOR, { ...currentFilm, comments });
        break;

    }
  };


  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    if(this.films.length > CARDS_PER_STEP){
      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonComponentAction);

      render(this.#filmsSectionComponent, this.#showMoreButtonComponent, RenderPosition.BEFORE_END);
    }
  }


  #handleShowMoreButtonComponentAction = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + CARDS_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    films.forEach((film) => this.#renderCard(film));
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

    this.#renderedFilmCount = resetRenderedFilmCount ?  CARDS_PER_STEP : Math.min(filmCount, this.#renderedFilmCount);

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

