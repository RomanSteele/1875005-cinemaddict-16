import AbstractView from './abstract-view.js';

const createFilmsQuantityTemplate = (count) => `<p>${count} movies inside</p>`;

export default class FilmsQuantityView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createFilmsQuantityTemplate(this.#count);
  }
}
