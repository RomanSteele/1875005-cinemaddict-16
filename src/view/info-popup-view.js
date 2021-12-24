import {shiftDurationToHours, COMMENTS_EMOJI} from './helpers.js';
import SmartView from './smart-view.js';

//для создания строк описания фильма
const createTableRowTemplate = (term, cell) => (
  `<tr class="film-details__row">
    <td class="film-details__term">${term}</td>
    <td class="film-details__cell">${cell}</td>
  </tr>`
);

//Разметка для жанров
const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;


//Подставляет в разметку Genres или Genre
const useGenreOrGenres = (genre) => {
  if (genre.length > 1) {
    return 'Genres';
  }
  return 'Genre';
};

//Создание комментария
const createCommentTemplate = ({ id, author, text, date, emotion }) => (
  `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${date}</span>
      <button class="film-details__comment-delete data-id="${id}">Delete</button>
    </p>
  </div>
</li>`
);


const createEmotionsTemplate = (emotionNames, emotion) => emotionNames.map((currentEmotion) => {
  const isChecked = (currentEmotion === emotion) ? 'checked' : '';

  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${currentEmotion}" value="${currentEmotion}" ${isChecked}>
  <label class="film-details__emoji-label" for="emoji-${currentEmotion}">
    <img src="./images/emoji/${currentEmotion}.png" width="30" height="30" alt="emoji-${currentEmotion}">
  </label>`;
}).join('');


const createControlButtonTemplate = (name, title, isActive) => {
  const activeClass = isActive ? 'film-details__control-button--active' : '';
  return (
    `<button type="button" class="film-details__control-button ${activeClass} film-details__control-button--${name}" id="${name}" name="${name}">${title}</button>`
  );
};

const createCommentsTemplate = (comments) => comments.map(createCommentTemplate).join('');

export const createInfoPopupTemplate = (film, comments) => {

  const {
    title,
    alternativeTitle,
    rating,
    imgSource,
    ageRating,
    director,
    writers,
    actors,
    release,
    releaseCountry,
    duration,
    genres,
    description,
    inWatchlist,
    isWatched,
    isFavourite,
    comment,
    emotion,
    //watchingDate,
  } = film;

  const commentsTemplate = createCommentsTemplate(comments);
  const genresTemplate = genres.map(createGenreTemplate).join('');
  const emotionsTemplate = createEmotionsTemplate(COMMENTS_EMOJI, emotion);

  const commentEmotionTemplate = (emotion) ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : '';


  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${imgSource}" alt="">
          <p class="film-details__age">${ageRating}+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>
          <table class="film-details__table">
          ${createTableRowTemplate('Director',director)}
          ${createTableRowTemplate('Writers',writers.join(', '))}
          ${createTableRowTemplate('Actors',actors.join(', '))}
          ${createTableRowTemplate('Release Date',release.format('DD MMMM YYYY'))}
          ${createTableRowTemplate('Runtime',shiftDurationToHours(duration))}
          ${createTableRowTemplate('Country',releaseCountry)}
          ${createTableRowTemplate(useGenreOrGenres(genres), genresTemplate)}
          </table>
          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
          ${createControlButtonTemplate('watchlist', 'Add to watchlist', inWatchlist )}
          ${createControlButtonTemplate('watched', 'Already watched', isWatched)}
          ${createControlButtonTemplate('favorite', 'Add to favorites', isFavourite)}
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">
        ${commentsTemplate}
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${commentEmotionTemplate}
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
          </label>
          <div class="film-details__emoji-list">
          ${emotionsTemplate}
          </div>
        </div>
      </section>`;
};

export default class InfoPopupView extends SmartView {

  constructor(card) {
    super();
    this._data = InfoPopupView.parseFilmToData({ ...card });

    this.#setInnerHandlers();
  }

  get template() {
    return createInfoPopupTemplate(this._data, this._data.comments);
  }

  restoreHandlers = () => {
    this.setClosePopupHandler(this._callback.closePopup);
    this.setWatchlistClickHandler(this._callback.clickWatchlist);
    this.setWatchedlistClickHandler(this._callback.clickWatchedList);
    this.setFavoritelistClickHandler(this._callback.clickFavoriteList);
    this.setCommentAddHandler(this._callback.commentAdd);
    this.#setInnerHandlers();
  };

  //для закрытия
  setClosePopupHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseButtonClick);
  }


  //Вотчлист
  setWatchlistClickHandler = (callback) => {
    this._callback.clickWatchlist = callback;

    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#onWatchlistClick);
  }


  //Просмотренное
  setWatchedlistClickHandler = (callback) => {
    this._callback.clickWatchedList = callback;

    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#onWatchedClick);
  }


  //Избранное
  setFavoritelistClickHandler = (callback) => {
    this._callback.clickFavoriteList = callback;

    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#onFavoriteClick);
  }


  //Добавление комментария
  setCommentAddHandler = (callback) => {
    this._callback.commentAdd = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#onCommentAdd);
  };


  // Для эмодзи и ввода комментария
  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#onCommentEmotionChange);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#onCommentInput);
  };


  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.closePopup();
  }

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.clickWatchlist();
  }

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.clickWatchedList();
  }

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.clickFavoriteList();
  }

  #onCommentEmotionChange = (evt) => {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value });
  };

  #onCommentInput = (evt) => {
    this.updateData({
      comment: evt.target.value
    }, true);
  };

  #onCommentAdd = (evt) => {
    if (!this._data.emotion || !this._data.comment) {
      return;
    }

    if (evt.code === 'Enter' && evt.ctrlKey) {
      const comment = {
        emotion: this._data.emotion,
        comment: this._data.comment,
      };

      this._callback.commentAdd(comment);
    }
  };

  static parseFilmToData = (film) => ({ ...film, comment: '', emotion: null });
}

