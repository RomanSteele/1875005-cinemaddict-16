import AbstractView from './abstract-view.js';

const createEmptyListTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class EmptyListView extends AbstractView {

  get template() {
    return createEmptyListTemplate();
  }
}
