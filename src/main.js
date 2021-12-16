import {RenderPosition, render} from './render.js';
import ProfileRatingView from './view/profile-rating-view.js';
import {generateFilter} from './mock/filter.js';
import {generateCard} from './mock/card.js';


import FilmsPresenter from './presenter/film-cards-presenter.js';


const films = Array.from({ length: 24 }, generateCard);
const filters = generateFilter(films);
const siteMain = document.querySelector('.main');
const filmsPresenter = new FilmsPresenter(siteMain);


//Звание пользователя ! Добавить логику и перенести в презентер
const siteHeader = document.querySelector('.header');
render(siteHeader, new ProfileRatingView().element, RenderPosition.BEFORE_END);


filmsPresenter.init(films, filters);
