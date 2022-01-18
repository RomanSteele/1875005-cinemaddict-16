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

    const parent = prevComponent.parentElement;

    this.removeElement();

    const newComponent = this.element;

    parent.replaceChild(newComponent, prevComponent);


    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not emplemented: restoreHandlers');
  }
}
