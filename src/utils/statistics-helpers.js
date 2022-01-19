import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const MINUTES_IN_HOUR = 60;

export const convertTime = (minutesQuantity) => {
  const count = minutesQuantity;
  const hours = (count / MINUTES_IN_HOUR);
  const roundedHours = Math.floor(hours);
  const minutes = (hours - roundedHours) * MINUTES_IN_HOUR;
  const roundedMinutes = Math.round(minutes);
  return {roundedHours, roundedMinutes} ;
};


export const getFilmsDuration = (films) => films.reduce((totalTime, currentFilm) => {
  totalTime += currentFilm.duration;
  return totalTime;
},0);


export const turnGenresToCountMap = (films) => Object
  .entries(films.reduce((accumulator, currentFilm) => {
    currentFilm.genres.forEach((genre) => {
      accumulator[genre] = genre in accumulator ? accumulator[genre]+1 : 1;
    });


    return accumulator;
  }, {}))
  .sort(([, currentGenreRepeating], [, nextGenreRepeating]) => nextGenreRepeating - currentGenreRepeating)
  .map(([genre, count]) => ({ genre, count }));

export const getTopGenre = (films) => turnGenresToCountMap(films)[0].genre;
