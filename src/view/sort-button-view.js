import AbstractView from './abstract-view.js';
import {SortType} from './utils.js';

const createSortButtonsTemplate = (sortType) => {
  const defaultClass = (SortType.DEFAULT === sortType) ? 'sort__button--active' : '';
  const dateClass = (SortType.DATE === sortType) ? 'sort__button--active' : '';
  const ratingClass = (SortType.RATING === sortType) ? 'sort__button--active' : '';

  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button ${defaultClass}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${dateClass}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${ratingClass}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
  );
};

export default class SortButtonView extends AbstractView {
  #sortType = null;

  init(sortType) {
    this.#sortType = sortType;
  }

  get template() {
    return createSortButtonsTemplate(this.#sortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
