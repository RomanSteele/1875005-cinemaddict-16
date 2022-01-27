import AbstractView from '../view/abstract-view.js';

const createFilmsMostCommentedTemplate = () => `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>`;

export default class FilmsMostCommentedView extends AbstractView{
  get template() {
    return createFilmsMostCommentedTemplate();
  }
}
