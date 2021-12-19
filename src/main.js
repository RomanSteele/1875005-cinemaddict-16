import {RenderPosition, render} from './render.js';
import FilmsView from './view/films-view.js';
import ProfileRatingView from './view/profile-rating-view.js';
import {generateFilter} from './mock/filter.js';
import {generateCard} from './mock/card.js';


import FilmsPresenter from './presenter/film-cards-presenter.js';


const films = Array.from({ length: 24 }, generateCard);
const filters = generateFilter(films);
const siteMain = document.querySelector('.main');

//Отрисовка .films
const allFilmsView = new FilmsView();
render(siteMain, allFilmsView.element, RenderPosition.BEFORE_END);


//Звание пользователя ! Добавить логику
const siteHeader = document.querySelector('.header');
render(siteHeader, new ProfileRatingView().element, RenderPosition.BEFORE_END);

const filmsPresenter = new FilmsPresenter(allFilmsView);
filmsPresenter.init(films, filters);
