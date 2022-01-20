const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }

  #adaptToServer = (film) => {
    const adaptedFilm = {
      'id': film.id,
      'comments': film.comments,
      'film_info': {
        'actors': film.actors,
        'age_rating': film.ageRating,
        'alternative_title': film.alternativeTitle,
        'description': film.description,
        'director': film.director,
        'genre': film.genres,
        'poster': film.imgSource,
        'release': {
          'date': film.releaseDate,
          'release_country': film.releaseCountry,
        },
        'runtime': film.duration,
        'title': film.title,
        'total_rating': film.rating,
        'writers': film.writers,
      },
      'user_details': {
        'already_watched': film.isWatched,
        'favorite': film.isFavorite,
        'watching_date': film.watchingDate,
        'watchlist': film.inWatchlist,
      },
    };
    return adaptedFilm;
  }
}
