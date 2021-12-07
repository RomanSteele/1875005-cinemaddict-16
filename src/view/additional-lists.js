import AbstractView from './abstract-view.js';

export const createExtraListsTemplate = (name) =>(
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${name}</h2>

</section>`
);

export default class AdditionalListsView extends AbstractView {

  get template() {
    return createExtraListsTemplate();
  }
}
