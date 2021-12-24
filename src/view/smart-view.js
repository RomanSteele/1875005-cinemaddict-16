import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
  _data = {};

  updateData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = { ...this._data, ...update };

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  };

  updateElement = () => {
    const prevComponent = this.element;
    const position = prevComponent.scrollTop;
    const parent = prevComponent.parentElement;
    this.removeElement();

    const newComponent = this.element;

    parent.replaceChild(newComponent, prevComponent);

    newComponent.scrollTo(0,position);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not emplemented: restoreHandlers');
  }
}
