import {COMMENT_EMOJIS} from '../utils/const.js';
import {shiftDurationToHours} from '../utils/helpers.js';
import SmartView from './smart-view.js';
import dayjs from 'dayjs';
import he from 'he';

import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const createTableRowTemplate = (term, cell) => (
  `<tr class="film-details__row">
    <td class="film-details__term">${term}</td>
    <td class="film-details__cell">${cell}</td>
  </tr>`
);


const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;


const useGenreOrGenres = (genre) => {
  if (genre.length > 1) {
    return 'Genres';
  }
  return 'Genre';
};


const createCommentTemplate = ({ id, author, comment, date, emotion },isDeleting, isDisabled, deletingCommentId) => (
  `<li class="film-details__comment" data-id="${id}">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(comment)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${he.encode(author)}</span>
      <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
      <button class="film-details__comment-delete" data-comment-id="${id}" ${isDisabled ? 'disabled' : ''}>${isDeleting && id === deletingCommentId ? 'Deleting...' : 'Delete'}</button>
    </p>
  </div>
</li>`
);


const createEmotionsTemplate = (emotionNames, emotion, isSaving) => emotionNames.map((currentEmotion) => {
  const isChecked = (currentEmotion === emotion) ? 'checked' : '';

  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji"${isSaving ? 'disabled' : ''} type="radio" id="emoji-${currentEmotion}" value="${currentEmotion}" ${isChecked}>
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

const createCommentsTemplate = (comments, isDeleting, isDisabled, deletingCommentId) => comments.map((comment) => createCommentTemplate(comment, isDeleting, isDisabled, deletingCommentId)).join('');

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
    releaseDate,
    releaseCountry,
    duration,
    genres,
    description,
    inWatchlist,
    isWatched,
    isFavorite,
    comment,
    emotion,
    isDisabled,
    isSaving,
    isDeleting,
    deletingCommentId,
  } = film;
  const commentsTemplate = createCommentsTemplate(comments, isDeleting, isDisabled, deletingCommentId);
  const genresTemplate = genres.map(createGenreTemplate).join('');
  const emotionsTemplate = createEmotionsTemplate(COMMENT_EMOJIS, emotion, isSaving);

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
          ${createTableRowTemplate('Release Date',releaseDate.format('DD MMMM YYYY'))}
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
          ${createControlButtonTemplate('favorite', 'Add to favorites', isFavorite)}
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
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSaving ? 'disabled' : ''}>${he.encode(comment)}</textarea>
          </label>
          <div class="film-details__emoji-list">
          ${emotionsTemplate}
          </div>
        </div>
      </section>`;
};

export default class InfoPopupView extends SmartView {
  #comments = null;
  #scrollPosition = null;

  constructor(film, comments) {
    super();
    this._data = InfoPopupView.parseFilmToData(film);
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createInfoPopupTemplate(this._data,this.#comments);
  }


  setClosePopupHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseButtonClick);
  }


  setWatchlistClickHandler = (callback) => {
    this._callback.clickWatchlist = callback;

    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#onWatchlistClick);
  }


  setWatchedlistClickHandler = (callback) => {
    this._callback.clickWatchedList = callback;

    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#onWatchedClick);
  }


  setFavoritelistClickHandler = (callback) => {
    this._callback.clickFavoriteList = callback;

    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#onFavoriteClick);
  }


  setCommentAddHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#onCommentInputKeydown);
  };


  setCommentDeleteHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((element) => element.addEventListener('click', this.#onCommentDelete));
  };


  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#onEmotionListChange);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#onCommentInput);
  };

  restore = (film) => {
    this._data = InfoPopupView.parseFilmToData(film);
  };


  restoreHandlers = () => {
    this.setClosePopupHandler(this._callback.closePopup);
    this.setWatchlistClickHandler(this._callback.clickWatchlist);
    this.setWatchedlistClickHandler(this._callback.clickWatchedList);
    this.setFavoritelistClickHandler(this._callback.clickFavoriteList);
    this.setCommentAddHandler(this._callback.addComment);
    this.setCommentDeleteHandler(this._callback.deleteComment);
    this.#setInnerHandlers();
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


  #onEmotionListChange = (evt) => {
    this.#scrollPosition = this.element.scrollTop ;
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value });
    this.element.scrollTop = this.#scrollPosition;
  };


  #onCommentInput = (evt) => {
    this.updateData({
      comment: evt.target.value
    }, true);
  };


  #onCommentInputKeydown = (evt) => {
    this.#scrollPosition = this.element.scrollTop ;
    if (evt.ctrlKey && evt.key === 'Enter' || evt.metaKey && evt.key === 'Enter'){
      if (this._data.comment === '' || this._data.emotion === '') {
        return;
      }
      const newComment = {
        comment: this._data.comment,
        emotion: this._data.emotion,
      };
      this._callback.addComment(newComment);
    }
    this.element.scrollTop = this.#scrollPosition;
  };


  #onCommentDelete = (evt) => {
    this.#scrollPosition = this.element.scrollTop ;
    evt.preventDefault();

    const parent = evt.currentTarget.closest('[data-id]');
    if (!parent) {
      return;
    }

    const id = parent.dataset.id;
    this._callback.deleteComment(id);
    this.element.scrollTop = this.#scrollPosition;
  };

  static parseFilmToData = (film) => (
    { comment: '',
      emotion: '',
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
      deletingCommentId: null,
      ...film});
}


