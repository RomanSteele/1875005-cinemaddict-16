import {RenderPosition, render, remove} from './utils/render.js';
import {generateCard} from './mock/card.js';
import FilmsView from './view/films-view.js';
import RankView from './view/rank-view.js';
import {StatisticsItem} from './utils/const.js';
import {shiftFilmsCountToUserRank} from './utils/helpers.js';

import FilterPresenter from './presenter/filter-presenter.js';
import FilmsPresenter from './presenter/film-cards-presenter.js';

import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';

import StatisticsButtonView from './view/statistics-button-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsQuantityView from './view/films-quantity-view.js';

import ApiService from './api-service.js';

const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

const films = Array.from({ length: 24 }, generateCard);
const AUTHORIZATION = 'Basic ZZqP5God45K5';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';

const comments = films.reduce((commentsList, film) => {
  const filmComments = film.comments;
  return [...commentsList, ...filmComments];
}, []);


const filterModel = new FilterModel();
//const filmsModel = new FilmsModel();
const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel();

filmsModel.films = films;
commentsModel.comments = comments;

const allFilmsView = new FilmsView();
render(siteMain, allFilmsView.element, RenderPosition.BEFORE_END);

const userRank = shiftFilmsCountToUserRank(filmsModel.films.filter((film) => film.isWatched).length);

const statisticsButtonComponent = new StatisticsButtonView();
const siteHeader = document.querySelector('.header');
render(siteHeader, new RankView(userRank), RenderPosition.BEFORE_END);

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

      statisticsComponent = new StatisticsView(filmsModel.films,userRank);
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
render(siteFooter, new FilmsQuantityView(films.length), RenderPosition.BEFORE_END);
filterPresenter.init();
filmsPresenter.init();

