import {RenderPosition, render} from './render.js';
import ProfileRatingView from './view/profile-rating-view.js';
import MenuView from './view/menu-view.js';
import SortButtonView from './view/sort-view.js';
import FilmsSectionView from './view/film-section-view.js';
import FilmsContainerView from './view/cards-container-view.js';
import FilmCardView from './view/film-card-view.js';
import InfoPopupView from './view/popup-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import FilmsView from './view/films-view.js';
import EmptyListView from './view/empty-list-view.js';


import {generateFilter} from './mock/filter.js';
import {generateCard} from './mock/card.js';

const FILM_CARDS_COUNT = 25;
const FIRST_FIVE_CARDS_COUNT = 5;
const CARDS_PER_STEP = 5;


//Массив из создаваемых карточек фильмов
const films = Array.from({length:FILM_CARDS_COUNT},generateCard);


//Передает в фильтры массив карточек
const filters = generateFilter(films);


const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');


//Звание пользователя
render(siteHeader, new ProfileRatingView().element, RenderPosition.BEFORE_END);


//Меню
render(siteMain, new MenuView(filters).element, RenderPosition.BEFORE_END);


//Сортировка
render(siteMain,new SortButtonView().element, RenderPosition.BEFORE_END);


//Фильмы
const fullFilmSection = new FilmsView();
render(siteMain, fullFilmSection.element, RenderPosition.BEFORE_END);


//Секция фильмов c проверкой наличия карточек
const filmSection = new FilmsSectionView();

if (films.length <= 0) {
  render(fullFilmSection.element, new EmptyListView().element, RenderPosition.BEFORE_END);
} else {
  render(fullFilmSection.element,filmSection.element, RenderPosition.BEFORE_END);
}


//Контейнер для фильмов
const containerComponent = new FilmsContainerView();
render(filmSection.element, containerComponent.element, RenderPosition.BEFORE_END);


//Для карточек и попапа
const renderFilmCard = (Component, card, comments) => {

  const filmCard = new FilmCardView(card);
  const filmPopup = new InfoPopupView(card, comments);

  //Открывает попап
  const openCurrentPopup = () => {
    render(siteMain, filmPopup.element, RenderPosition.BEFORE_END);
  };

  //Обработчик на карточку для открытия попапа
  filmCard.element.querySelector('.film-card__link').addEventListener('click', () => {
    openCurrentPopup();
    siteMain.classList.add('hide-overflow');
  });


  filmPopup.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    siteMain.removeChild(filmPopup.element);
    siteMain.classList.remove('hide-overflow');
  });

  render(Component, filmCard.element, RenderPosition.BEFORE_END);
};


//Карточка фильма первые 5
for (let i = 0; i < Math.min(films.length, FIRST_FIVE_CARDS_COUNT); i++) {
  renderFilmCard(containerComponent.element, films[i], films[i].comments);
}


//Кнопка 'Show more'
if (films.length > CARDS_PER_STEP) {
  let renderedCardsCount = CARDS_PER_STEP;
  render(filmSection.element, new ShowMoreButtonView().element, RenderPosition.BEFORE_END);

  const showMoreButton = filmSection.element.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click',(evt) => {
    evt.preventDefault();
    films
      .slice(renderedCardsCount, renderedCardsCount + CARDS_PER_STEP)
      .forEach((card) => renderFilmCard(containerComponent.element ,card ,card.comments));


    renderedCardsCount += CARDS_PER_STEP;

    if (renderedCardsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}
