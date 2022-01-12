import FiltersView from '../view/filters-view.js';
import {render, RenderPosition, replace, remove} from '../render.js';
import {filters} from '../filters.js';
import {FilterType, UpdateType} from '../view/helpers.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'all',
        title: 'All movies',
        count: filters[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'watchlist',
        title: 'Watchlist',
        count: filters[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'history',
        title: 'History',
        count: filters[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITE,
        name: 'favorites',
        title: 'Favorites',
        count: filters[FilterType.FAVORITE](films).length,
      },
    ];
  }

  init = () => {
    const filterItems = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filterItems, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTER_BEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  removeActiveClass = () => {
    this.#filterComponent.removeActiveClass();
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    const isStatisticsOpened = document.querySelector('.main-navigation__additional--active');

    if (document.contains(isStatisticsOpened) === false && this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
