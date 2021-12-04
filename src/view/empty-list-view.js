import {createElement} from '../render.js';

const createEmptyListTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class EmptyListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEmptyListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
