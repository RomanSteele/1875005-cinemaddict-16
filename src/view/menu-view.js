const createNavigationClass = (href,listTitle, Quantity, isActive=false) => {
  const acviteClass = isActive ? 'main-navigation__item--active' : '';
  return(
    `<a href="#${href}" class="main-navigation__item">${listTitle} <span class="main-navigation__item-count ${acviteClass}">${Quantity}</span></a>`
  );
};

export const createMenuTemplate = () => (
  `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${createNavigationClass('watchlist','Watchlist','13')}
    ${createNavigationClass('history','History','4')}
    ${createNavigationClass('favorites','Favorites','8')}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`
);
