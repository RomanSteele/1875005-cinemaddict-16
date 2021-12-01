export const createExtraListsTemplate = () =>(
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

</section>`
);


/*const createControlButtonTemplate = (name, title, isActive) => {
  const activeClass = isActive ? 'film-card__controls-item--active' : '';
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${name} ${activeClass}">
      ${title}
    </button>`
  );
};

const createExtraTemplate = ()
export const createExtraList = (
  (film = {}) => {
    const {
      title = '',
      rating = '',
      year = '',
      duration = '',
      genre = '',
      imgSource = '',
      alt = '',
      description = 'description',
      comments = '8 comments',
      inWatchlist = false,
      isWatched = false,
      isFavourite = true,
    } = film;

    return `<div class="films-list__container">
    <article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${year}</span>
          <span class="film-card__duration">${duration}</span>
          <span class="film-card__genre">${genre}</span>
        </p>
        <img src="${imgSource}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">${comments}</span>
      </a>
      <div class="film-card__controls">
      ${createControlButtonTemplate('add-to-watchlist', 'Add to watchlist', inWatchlist )}
      ${createControlButtonTemplate('mark-as-watched', 'Mark as watched', isWatched)}
      ${createControlButtonTemplate('favorite', 'Mark as favorite', isFavourite)}
      </div>`


      const createExtraTemplate =
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>


        </section>
        `;
);
*/
