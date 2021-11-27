const createNavigationTemplate = (href,listTitle, quantity, isActive=false) => {
  const acviteClass = isActive ? 'main-navigation__item--active' : '';
  return(
    `<a href="#${href}" class="main-navigation__item ${acviteClass}">${listTitle} <span class="main-navigation__item-count">${quantity}</span></a>`
  );
};

export const createMenuTemplate = () => (
  `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${createNavigationTemplate('watchlist','Watchlist','13')}
    ${createNavigationTemplate('history','History','4')}
    ${createNavigationTemplate('favorites','Favorites','8')}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`
);
