import SortButtonView from '../view/sort-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';

import {RenderPosition, render, remove} from '../utils/render.js';
import { sortFilmsByDate, sortFilmsByRating, sortExtraListMostCommented, sortExtraListTopRated} from '../utils.js';

import SingleCardPresenter from './film-presenter.js';
import {filterTypeToFilms, actionTypeToFilterType } from '../utils/filters.js';
import {SortType, UserAction, UpdateType} from '../utils/const.js';

import FilmPopupPresenter from './popup-presenter.js';

import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';


const CARDS_PER_STEP = 5;
const CARDS_FOR_EXTRA =2;


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

  #containerForTopRated = new FilmsContainerView();
  #containerForMostCommented = new FilmsContainerView();
  #commentExtraComponent = new FilmsMostCommentedView();
  #topExtraComponent = new FilmsTopRatedView();

  #loadingComponent = new LoadingView();

  #renderedFilmCount = CARDS_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #isErased = false;
  #isLoading = true;

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
    render(this.#container, this.#topExtraComponent, RenderPosition.BEFORE_END);
    render(this.#container, this.#commentExtraComponent, RenderPosition.BEFORE_END);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#isErased = false;
  }


  erase = () => {
    this.#clearBoard();

    remove(this.#filmContainerComponent);
    remove(this.#filmsSectionComponent);

    remove(this.#topExtraComponent);
    remove(this.#commentExtraComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleModelEvent);

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


  #renderCard = (container, film) => {
    const presenter = new SingleCardPresenter(
      container,
      this.#handleViewAction,
      this.#handleModeChange,
    );

    presenter.init(film);
    this.#filmsPresenter.set(film.id, presenter);
  }


  #renderCards = (films) => {
    films.forEach((film)=> this.#renderCard(this.#filmContainerComponent, film));
  }

  #renderLoading = () => {
    render(this.#filmsSectionComponent, this.#loadingComponent, RenderPosition.AFTER_BEGIN);
  }


  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterModel.filter);
    render(this.#filmsSectionComponent, this.#emptyListComponent, RenderPosition.BEFORE_END);
  }


  #renderPopup = (filmId) => {
    const film = this.#filmsModel.films.find((filmItem) => filmId === filmItem.id);
    this.#commentsModel.init(filmId).finally(() => {
      if (this.#popupPresenter && this.#popupPresenter.film.id !== filmId) {
        this.#popupPresenter.resetView();
      }

      this.#popupPresenter = new FilmPopupPresenter(this.#handleViewAction);
      const comments = this.#commentsModel.comments;
      this.#popupPresenter.init(film, comments);
    });
  }


  #initPopup = () => {
    if (this.#popupPresenter) {
      const filmId = this.#popupPresenter.film.id;
      const film = this.#filmsModel.films.find((filmItem) => filmId === filmItem.id);

      const comments = this.#commentsModel.comments;
      this.#popupPresenter.init(film, comments);
    }
  };

  #renderTopExtra = () => {
    const sortFilmsRating = this.#filmsModel.films.sort(sortExtraListTopRated);
    render(this.#topExtraComponent, this.#containerForTopRated, RenderPosition.BEFORE_END);

    for (let i = 0; i < CARDS_FOR_EXTRA; i++) {
      this.#renderCard(this.#containerForTopRated, sortFilmsRating[i]);
    }
  }


  #renderCommentExtra = () => {
    const sortFilmsComments = this.#filmsModel.films.sort(sortExtraListMostCommented);
    render(this.#commentExtraComponent, this.#containerForMostCommented, RenderPosition.BEFORE_END);
    for (let i = 0; i < CARDS_FOR_EXTRA; i++) {
      this.#renderCard(this.#containerForMostCommented, sortFilmsComments[i]);
    }
  }


  #renderBothExtra = () => {
    this.#renderTopExtra();
    this.#renderCommentExtra();
  }


  #clearBothExtra = () =>{
    remove(this.#containerForTopRated);
    remove(this.#containerForMostCommented);
  }


  #handleModeChange = (filmId) => {
    this.#renderPopup(filmId);
  }


  #handleViewAction = (actionType, updateType, update, film, filmId) => {
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
        this.#commentsModel.addComment(updateType, update, film, filmId);
        break;

      case UserAction.COMMENT_DELETE:
        this.#commentsModel.deleteComment(updateType, update, film);
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

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }

  }

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

    films.forEach((film) => this.#renderCard(this.#filmContainerComponent ,film));
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  }


  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    //this.#clearBothExtra();
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#emptyListComponent);
    remove(this.#showMoreButtonComponent);


    this.#renderedFilmCount = resetRenderedFilmCount ?  CARDS_PER_STEP : Math.min(filmCount, this.#renderedFilmCount);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }


  #renderBoard = () =>{
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
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
    //this.#renderBothExtra();
  }

}

