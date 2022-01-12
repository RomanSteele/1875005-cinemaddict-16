import AbstractView from './abstract-view.js';
import {FilterType} from '../view/helpers.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now',
};

const createEmptyListTemplate = (filterType) => {
  const noTaskTextValue = NoFilmsTextType[filterType];

  return (
    `<h2 class="films-list__title">${noTaskTextValue}</h2>`);
};

export default class EmptyListView extends AbstractView {

  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createEmptyListTemplate(this._data);
  }
}
