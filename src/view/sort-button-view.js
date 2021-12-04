import {createElement} from '../render.js';

const createSortButton = (title, isActive = false) => {
  const activeClass = isActive ? 'sort__button--active' : '';
  return (
    `<li><a href="#" class="sort__button ${activeClass}">${title}</a></li>`
  );
};

const createSortButtonsTemplate = () =>(
  `<ul class="sort">
    ${createSortButton('Sort by default')}
    ${createSortButton('Sort by date')}
    ${createSortButton('Sort by rating')}
  </ul>`
);

export default class SortButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSortButtonsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
