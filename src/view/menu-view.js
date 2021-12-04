import {createElement} from '../render.js';


const createNavigationTemplate = ({ name, title, count, isActive = false } = {}) => {
  const acviteClass = isActive ? 'main-navigation__item--active' : '';

  return (
    `<a href="#${name}" class="main-navigation__item ${acviteClass}">${title}<span class="main-navigation__item-count">${count}</span></a>`
  );
};


const createMenuTemplate = (filters) => (
  `<nav class="main-navigation">
  <div class="main-navigation__items">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filters.map(createNavigationTemplate).join('')}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`
);


export default class MenuView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMenuTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
