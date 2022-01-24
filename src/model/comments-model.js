import AbstractObservable from '../model/abstract-observable.js';


export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor (apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (filmId) => {
    try {
      const comments = await this.#apiService.getComments(filmId);
      this.#comments = comments.map(this.#adaptToClient);
    } catch (err) {
      this.#comments = [];
    }
  }

  addComment = async (updateType, update, film, filmId) => {
    try {
      const response = await this.#apiService.addComment(update, filmId);
      this.#comments = [
        response,
        ...this.#comments,
      ];
      film = {...film, comments: response.movie.comments};
      this._notify(updateType, film);
    } catch(error) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, commentId, film) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(commentId);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1)
      ];
      film = {...film, comments: film.comments.filter((comment) => comment !== commentId)};
      this._notify(updateType, film);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };


  #adaptToClient = (comment) => {
    const adaptedComment = {
      id: comment.id,
      text: comment.comment,
      author: comment.author,
      date: comment.date,
      emotion: comment.emotion,
    };
    return adaptedComment;
  }
}
