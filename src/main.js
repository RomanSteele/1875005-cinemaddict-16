import {RenderPosition, render} from './render.js';
import ProfileRatingView from './view/profile-rating-view.js';
import MenuView from './view/menu-view.js';
import SortButtonView from './view/sort-button-view.js';
import FilmsSectionView from './view/films-section-view.js';
import FilmsContainerView from './view/films-container-view.js';
import FilmCardView from './view/film-card-view.js';
import InfoPopupView from './view/info-popup-view.js';
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
const sortSection = new SortButtonView();
render(siteMain,sortSection.element, RenderPosition.BEFORE_END);


//Фильмы
const fullFilmSection = new FilmsView();
render(siteMain, fullFilmSection.element, RenderPosition.BEFORE_END);


//Секция фильмов c проверкой наличия карточек
const filmSection = new FilmsSectionView();

if (films.length > 0) {
  render(fullFilmSection.element,filmSection.element, RenderPosition.BEFORE_END);
} else {
  render(fullFilmSection.element, new EmptyListView().element, RenderPosition.BEFORE_END);
  siteMain.removeChild(sortSection.element);
}


//Контейнер для фильмов
const containerSection = new FilmsContainerView();
render(filmSection.element, containerSection.element, RenderPosition.BEFORE_END);


//Для карточек и попапа
const renderFilmCard = (container, card, comments) => {

  const filmCard = new FilmCardView(card);
  const filmPopup = new InfoPopupView(card, comments);

  //Открывает попап
  const openCurrentPopup = () => {
    render(siteMain, filmPopup.element, RenderPosition.BEFORE_END);
  };

  //DRY для попапа
  const erasePopup = () => {
    siteMain.removeChild(filmPopup.element);
    siteMain.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  };


  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      erasePopup(onEscKeyDown);
    }
  };

  //Обработчик на карточку для открытия попапа
  filmCard.setOpenHandler (() => {
    openCurrentPopup();
    siteMain.classList.add('hide-overflow');
    document.addEventListener('keydown',onEscKeyDown);
  });

  //Для закрытия попапа
  filmPopup.setCloseHandler(() => {
    erasePopup(onEscKeyDown);
  });

  render(container, filmCard.element, RenderPosition.BEFORE_END);
};


//Карточка фильма первые 5
for (let i = 0; i < Math.min(films.length, FIRST_FIVE_CARDS_COUNT); i++) {
  renderFilmCard(containerSection.element, films[i], films[i].comments);
}

const showMoreButtonView = new ShowMoreButtonView();
//Кнопка 'Show more'
if (films.length > CARDS_PER_STEP) {
  let renderedCardsCount = CARDS_PER_STEP;
  render(filmSection.element, showMoreButtonView.element, RenderPosition.BEFORE_END);

  showMoreButtonView.setClickHandler(() => {
    films
      .slice(renderedCardsCount, renderedCardsCount + CARDS_PER_STEP)
      .forEach((card) => renderFilmCard(containerSection.element ,card ,card.comments));


    renderedCardsCount += CARDS_PER_STEP;

    if (renderedCardsCount >= films.length) {
      showMoreButtonView.element.remove();
    }
  });
}
