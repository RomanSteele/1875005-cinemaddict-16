import AbstractView from '../view/abstract-view.js';


export const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};


export const render = (container, element, place) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFORE_BEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTER_BEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFORE_END:
      parent.append(child);
      break;
    case RenderPosition.AFTER_END:
      parent.after(child);
      break;
  }
};


export const createElement = (template) => {
  const newContainer = document.createElement('div');
  newContainer.innerHTML = template;
  return newContainer.firstElementChild;
};


export const replace = (newComponent, oldComponent) => {
  if (newComponent === null || oldComponent === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newComponent instanceof AbstractView ? newComponent.element : newComponent;
  const oldChild = oldComponent instanceof AbstractView ? oldComponent.element : oldComponent;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};


export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};
