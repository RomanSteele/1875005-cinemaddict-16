import {RenderPosition, renderTemplate} from './render.js';
import {createProfileRatingTemplate} from './view/profile-rating-view.js';
import {createMenuTemplate} from './view/menu-view.js';
import {createSortButtonsTemplate} from './view/sort-view.js';
import {createFilmsSectionTemplate} from './view/film-section-view.js';
import {createFilmsContainerTemplate} from './view/cards-container-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
//import {createInfoPopupTemplate} from './view/popup-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';

import {generateFilter} from './mock/filter.js';
import {generateCard} from './mock/card.js';


const FILM_CARDS_COUNT = 19;
//const FIRST_FIVE_CARDS_COUNT = 5;
const CARDS_PER_STEP = 5;


//Массив из создаваемых карточек фильмов
const films = Array.from({length:FILM_CARDS_COUNT},generateCard);


//Передает в фильтры массив карточек
const filters = generateFilter(films);


const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');


//Звание пользователя
renderTemplate(siteHeader, createProfileRatingTemplate());


//Меню
renderTemplate(siteMain, createMenuTemplate(filters));


//Сортировка
renderTemplate(siteMain,createSortButtonsTemplate());


//Секция фильмов
renderTemplate(siteMain,createFilmsSectionTemplate());

const filmsListSection = siteMain.querySelector('.films-list');


//Контейнер для фильмов
renderTemplate(filmsListSection, createFilmsContainerTemplate());

const siteFilmSection = siteMain.querySelector('.films-list__container');


//Карточка фильма первые 5
for (let i = 0; i < Math.min(films.length, CARDS_PER_STEP); i++) {
  renderTemplate(siteFilmSection, createFilmCardTemplate(films[i]));
}


//Кнопка 'Show more'
if (films.length > CARDS_PER_STEP) {
  let renderedCardsCount = CARDS_PER_STEP;
  renderTemplate(filmsListSection, createShowMoreButtonTemplate(),RenderPosition.BEFORE_END);

  const showMoreButton = filmsListSection.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click',(evt) => {
    evt.preventDefault();
    films
      .slice(renderedCardsCount, renderedCardsCount + CARDS_PER_STEP)
      .forEach((card) => renderTemplate(siteFilmSection, createFilmCardTemplate(card)));


    renderedCardsCount += CARDS_PER_STEP;

    if (renderedCardsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}


//Попап с подробной информацией
//renderTemplate(siteMain, createInfoPopupTemplate(films[0]));
