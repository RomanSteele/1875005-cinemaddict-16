import AbstractView from './abstract-view.js';


const createNavigationTemplate = (filter, currentFilterType) => {
  const { type, name, title, count } = filter;

  if (filter.name === 'all')
  {return`<a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"data-filter-type="${type}" data-menu-item="${type}">${title}</a>`;}

  return (
    `<a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"data-filter-type="${type}" data-menu-item="${type}">${title}<span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createNavigationTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};


export default class FiltersView extends AbstractView{
  #filters = null;
  #currentFilter = '';


  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters,this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {

    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#onFilterClick);
  }

  removeActiveClass = () => {

    this.element.querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
  }


  #onFilterClick = (evt) => {
    evt.preventDefault();
    if (!evt.target.classList.contains('main-navigation__item')) {
      return;
    }

    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
