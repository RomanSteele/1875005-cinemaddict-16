import InfoPopupView from '../view/info-popup-view.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';


export default class FilmPopupPresenter {
  #changeData = null;
  #changeMode = null;

  #filmPopup = null;
  #scrollTop = 0;

  #film = null;
  #comments = null;

  constructor(changeData, changeMode) {
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  get film(){
    return this.#film;
  }

  init = (film,comments) => {
    this.#film = film;
    this.#comments = comments;
    this.#renderPopup();
  }

#renderPopup = () => {
  const prevFilmPopup = this.#filmPopup;
  this.#filmPopup = new InfoPopupView(this.#film, this.#comments);
  this.#filmPopup.setClosePopupHandler(this.#handleCloseButtonClick);
  this.#filmPopup.setWatchlistClickHandler(this.#handleWatchlistClick);
  this.#filmPopup.setWatchedlistClickHandler(this.#handleWatchedClick);
  this.#filmPopup.setFavoritelistClickHandler(this.#handleFavoriteClick);
  //this.#filmPopup.setCommentAddHandler(this.#handleCommentAdd);
  this.#filmPopup.setCommentDeleteHandler(this.#handleCommentDelete);

  if(prevFilmPopup !== null){
    this.#scrollTop = prevFilmPopup.element.scrollTop;
    remove(prevFilmPopup);
  }
  this.#openPopup();
  this.#filmPopup.element.scrollTop = this.#scrollTop;
}


resetView = () => {
  this.#destroyPopup();
}


#openPopup = () => {
  document.addEventListener('keydown', this.#onEscKeyDown);
  document.body.classList.add('hide-overflow');
  render(document.body, this.#filmPopup, RenderPosition.BEFORE_END);
};


#destroyPopup = () => {
  this.#filmPopup.element.remove();
  document.removeEventListener('keydown', this.#onEscKeyDown);
  document.body.classList.remove('hide-overflow');
}


#handleCloseButtonClick = () => {
  this.#destroyPopup();
  document.removeEventListener('keydown', this.#onEscKeyDown);
};


#handleWatchlistClick = () => {
  const inWatchlist = !this.#film.inWatchlist;
  this.#changeData(
    UserAction.WATCHLIST_ADD,
    UpdateType.MINOR,
    {...this.#film,
      inWatchlist,
    },);
};


#handleWatchedClick = () => {
  const isWatched = !this.#film.isWatched;
  this.#changeData(
    UserAction.WATCHED_ADD,
    UpdateType.MINOR,
    {...this.#film,
      isWatched,
      watchingDate: isWatched ? new Date() : null,
    },);
};


#handleFavoriteClick = () => {
  const isFavorite = !this.#film.isFavorite;
  this.#changeData(
    UserAction.FAVORITE_ADD,
    UpdateType.MINOR,
    {...this.#film,
      isFavorite,
    });
};

/*
#handleCommentAdd = (comment) => {
  const newComment = { ...generateComment(Math.random()), ...comment};
  this.#changeData(
    UserAction.COMMENT_ADD,
    UpdateType.MINOR,
    newComment,);
};
*/

#handleCommentDelete = (commentId) => {
  this.#changeData(
    UserAction.COMMENT_DELETE,
    UpdateType.MINOR,
    commentId,{...this.#film});
}


#onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    this.#filmPopup.restore(this.#film);
    this.#destroyPopup();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }
};
}

