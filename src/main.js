import {RenderPosition, render, remove} from './render.js';
import {generateCard} from './mock/card.js';
import FilmsView from './view/films-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import {StatisticsItem} from './view/helpers.js';

import FilterPresenter from './presenter/filter-presenter.js';
import FilmsPresenter from './presenter/film-cards-presenter.js';

import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';

import StatisticsButtonView from './view/statistics-button-view.js';
import StatisticsView from './view/statistics-view.js';

const siteMain = document.querySelector('.main');

const films = Array.from({ length: 24 }, generateCard);


const comments = films.reduce((commentsList, film) => {
  const comment = film.comments;
  return [...commentsList, ...comment];
}, []);


const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

filmsModel.films = films;
commentsModel.comments = comments;

const allFilmsView = new FilmsView();
render(siteMain, allFilmsView.element, RenderPosition.BEFORE_END);

const statisticsButtonComponent = new StatisticsButtonView();
const siteHeader = document.querySelector('.header');
render(siteHeader, new ProfileRatingView().element, RenderPosition.BEFORE_END);

const filterPresenter = new FilterPresenter(statisticsButtonComponent, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(allFilmsView, filmsModel, filterModel, commentsModel);

let statisticsComponent = null;
let currentStatisticsItem = null;

const handleStatsClick = (statisticsItem) => {
  if (currentStatisticsItem === statisticsItem) {
    return;
  }

  switch (statisticsItem) {
    case StatisticsItem.STATISTICS:

      statisticsComponent = new StatisticsView(filmsModel.films);
      filmsPresenter.erase();
      filterPresenter.removeActiveClass();
      render(siteMain, statisticsComponent, RenderPosition.BEFORE_END);
      break;
    default:
      remove(statisticsComponent);
  }

  currentStatisticsItem = statisticsItem;
};

statisticsButtonComponent.setStatisticsButtonClickHandler(handleStatsClick);
render(siteMain, statisticsButtonComponent, RenderPosition.AFTER_BEGIN);
filterPresenter.init();
filmsPresenter.init();

