const createControlButtonTemplate = (name, title, isActive) => {
  const activeClass = isActive ? 'film-card__controls-item--active' : '';
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${name} ${activeClass}">
      ${title}
    </button>`
  );
};


export const createFilmCardTemplate = (film = {}) => {
//Приводит минуты к формату
  function durationToHours (mins) {
    const hours = Math.trunc(mins/60);
    const minutes = mins % 60;
    return `${hours  }h ${  minutes  }m`;
  }

  const {
    title = '',
    rating = '',
    release = '',
    duration = '',
    genre = [],
    imgSource = '',
    alt = '',
    description = 'description',
    comments = '8 comments',
    inWatchlist = false,
    isWatched = false,
    isFavourite = true,
  } = film;

  return` <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${release.format('YYYY')}</span>
              <span class="film-card__duration">${durationToHours(duration)}</span>
              <span class="film-card__genre">${genre[0]}</span>
            </p>
            <img src="./${imgSource}" alt="${alt}" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
          ${createControlButtonTemplate('add-to-watchlist', 'Add to watchlist', inWatchlist )}
          ${createControlButtonTemplate('mark-as-watched', 'Mark as watched', isWatched)}
          ${createControlButtonTemplate('favorite', 'Mark as favorite', isFavourite)}
          </div>
  </article>
  `;
};
