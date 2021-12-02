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
const genreOrGenres = (genre) => {
  if (genre.length > 1) {
    return 'Genres';
  }
  return 'Genre';
};

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

const createControlButtonTemplate = (name, title, isActive) => {
  const activeClass = isActive ? 'film-details__control-button--active' : '';
  return (
    `<button type="button" class="film-details__control-button ${activeClass} film-details__control-button--${name}" id="${name}" name="${name}">${title}</button>`
  );
};

const createCommentsTemplate = (comments) => comments.map(createCommentTemplate).join('');


export const createInfoPopupTemplate = (film = {}, comments) => {

  //Приводит минуты к формату
  function durationToHours (mins) {
    const hours = Math.trunc(mins/60);
    const minutes = mins % 60;
    return `${hours  }h ${  minutes  }m`;
  }

  const {
    title = '',
    alternativeTitle = '',
    rating = 9.5,
    imgSource = '',
    ageRating = 18,
    director = '',
    writers = '',
    actors = '',
    release = '',
    releaseCountry ='',
    //year = '',
    duration = 77,
    genre = [],
    //alt = '',
    description = '',
    inWatchlist = false,
    isWatched = false,
    isFavourite = false,
    //watchingDate = '',
  } = film;

  const commentsTemplate = createCommentsTemplate(comments);
  const genresTemplate = genre.map(createGenreTemplate).join('');

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
          ${createTableRowTemplate('Writers',writers)}
          ${createTableRowTemplate('Actors',actors)}
          ${createTableRowTemplate('Release Date',release.format('DD MMMM YYYY'))}
          ${createTableRowTemplate('Runtime',durationToHours(duration))}
          ${createTableRowTemplate('Country',releaseCountry)}
          ${createTableRowTemplate(genreOrGenres(genre), genresTemplate)}
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
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>`;
};