import {renderTemplate} from './render.js';
import {createProfileRatingTemplate} from './view/profile-rating-view.js';
import {createMenuTemplate} from './view/menu-view.js';
import {createSortButtonsTemplate} from './view/sort-view.js';
import {filmsSectionTemplate} from './view/films-section-view.js';
import {createFilmsContainer} from './view/cards-container-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
//import {createInfoPopupTemplate} from './view/info-popup-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';

const FILM_CARDS_COUNT = 5;

const siteHeader = document.querySelector('.header');

//Звание пользователя
renderTemplate(siteHeader, createProfileRatingTemplate());

const siteMain = document.querySelector('.main');

//Меню
renderTemplate(siteMain, createMenuTemplate());

//Сортировка
renderTemplate(siteMain,createSortButtonsTemplate());


//Секция фильмов
renderTemplate(siteMain,filmsSectionTemplate());

const filmsListSection = siteMain.querySelector('.films-list');

//Контейнер для фильмов
renderTemplate(filmsListSection, createFilmsContainer());

const siteFilmSection = siteMain.querySelector('.films-list__container');

//Карточка фильма
for (let i = 0; i < FILM_CARDS_COUNT; i++) {
  renderTemplate(siteFilmSection, createFilmCardTemplate());
}

//Попап с подробной информацией
//renderTemplate(siteMain, createInfoPopupTemplate());

//Кнопка 'Show more'
renderTemplate(siteFilmSection, createShowMoreButtonTemplate());
