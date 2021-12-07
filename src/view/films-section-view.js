import AbstractView from './abstract-view.js';

const createFilmsSectionTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`);


export default class FilmsSectionView extends AbstractView{

  get template() {
    return createFilmsSectionTemplate();
  }
}
