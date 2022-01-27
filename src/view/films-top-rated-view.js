import AbstractView from '../view/abstract-view.js';

const createFilmsTopRatedTemplate = () => `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`;

export default class FilmsTopRatedView extends AbstractView{
  get template() {
    return createFilmsTopRatedTemplate();
  }
}
