import {createElement} from '../render.js';

const createFilmsSectionTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`);


export default class FilmsSectionView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsSectionTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
