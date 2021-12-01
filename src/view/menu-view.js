const createNavigationTemplate = (href, listTitle, quantity, isActive=false) => {
  const {count} = quantity;
  const acviteClass = isActive ? 'main-navigation__item--active' : '';
  return(
    `<a href="${href}" class="main-navigation__item ${acviteClass}">${listTitle} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createMenuTemplate = (quantity) => (
  `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${createNavigationTemplate('watchlist','Watchlist',quantity)}
    ${createNavigationTemplate('history','History',quantity)}
    ${createNavigationTemplate('favorites','Favorites',quantity)}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`
);


