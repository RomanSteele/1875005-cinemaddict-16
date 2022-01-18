import AbstractObservable from '../model/abstract-observable.js';
import {FilterType} from '../utils/helpers.js';

export default class FilterModel extends AbstractObservable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
