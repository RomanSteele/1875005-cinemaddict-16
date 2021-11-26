import {createProfileRatingTemplate} from './view/profile-rating-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {createFilmCardTemplate} from './view/film-card-in-list-view.js';
import {createMenuTemplate} from './view/menu-filters-statistics-view.js';
import {createInfoPopupTemplate} from './view/info-popup-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';

const TASK_COUNT = 5;

const siteHeaderElement = document.querySelector('.header');

//Звание пользователя
renderTemplate(siteHeaderElement, createProfileRatingTemplate(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

//Меню
renderTemplate(siteMainElement, createMenuTemplate(), RenderPosition.BEFOREEND);

//Карточка фильма
const siteFilmSection = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < TASK_COUNT; i++) {
  renderTemplate(siteFilmSection, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}


//Попап с подробной информацией
renderTemplate(siteMainElement, createInfoPopupTemplate(), RenderPosition.BEFOREEND);

//Кнопка 'Show more'
renderTemplate(siteMainElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
