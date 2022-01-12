import AbstractView from './abstract-view.js';
import {StatisticsItem} from './helpers.js';

const createStatisticsButtonTemplate = () => `<nav class="main-navigation">
  <a href="${StatisticsItem.STATISTICS}" class="main-navigation__additional" data-statistics-item="${StatisticsItem.STATISTICS}">Stats</a>
</nav>`;

export default class StatisticsButtonView extends AbstractView {
  get template() {
    return createStatisticsButtonTemplate();
  }

  setStatisticsButtonClickHandler = (callback) => {
    this._callback.statisticsButtonClick = callback;

    this.element.addEventListener('click', this.#statisticsButtonClickHandler);
  };

  #statisticsButtonClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== 'A') {
      return;
    }

    this.element.querySelectorAll('.main-navigation__additional').forEach((element) => element?.classList.remove('main-navigation__additional--active'));

    if (evt.target.classList.contains('main-navigation__additional')) {
      evt.target.classList.add('main-navigation__additional--active');
    }

    this._callback.statisticsButtonClick(evt.target.dataset.statisticsItem);
  };
}
