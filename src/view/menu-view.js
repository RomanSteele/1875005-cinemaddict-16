import AbstractView from './abstract-view.js';


const createNavigationTemplate = ({ name, title, count, isActive } = {}) => {
  const acviteClass = isActive ? 'main-navigation__item--active' : '';

  return (
    `<a href="#${name}" class="main-navigation__item ${acviteClass}">${title}<span class="main-navigation__item-count">${count}</span></a>`
  );
};


const createMenuTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map(createNavigationTemplate)
    .join('');

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};


export default class MenuView extends AbstractView{
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMenuTemplate(this.#filters);
  }
}
