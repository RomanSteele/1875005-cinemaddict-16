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
      this.#comments = comments;
    } catch (err) {
      this.#comments = [];
    }
  }


  addComment = async (updateType, payload) => {
    const {newComment, film, filmId} = payload;
    try {
      const response = await this.#apiService.addComment(newComment, filmId);
      this.#comments = response.comments;
      const updatedFilm = {...film, comments: response.movie.comments};

      this._notify(updateType, updatedFilm);
    } catch(error) {
      throw new Error('Can\'t add comment');
    }
  }


  deleteComment = async (updateType, payload) => {
    const {commentId, film} = payload;
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
      const updatedFilm = {...film, comments: film.comments.filter((comment) => comment !== commentId)};
      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

}
