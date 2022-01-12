import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const timeConvert = (minutesQuantity) => {
  const number = minutesQuantity;
  const hours = (number / 60);
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return {rhours, rminutes} ;
};


export const getFilmsDuration = (films) => films.reduce((totalTime, currentFilm) => {
  totalTime += currentFilm.duration;
  return totalTime;
}, 0);


export const genresToCountMap = (films) => Object
  .entries(films.reduce((acc, currentFilm) => {
    currentFilm.genres.forEach((genre) => {
      if (genre in acc) {
        acc[genre] += 1;
      } else {
        acc[genre] = 1;
      }
    });

    return acc;
  }, {}))
  .sort(([, currentGenreRepeating], [, nextGenreRepeating]) => nextGenreRepeating - currentGenreRepeating)
  .map(([genre, count]) => ({ genre, count }));

export const getTopGenre = (films) => genresToCountMap(films)[0].genre;
