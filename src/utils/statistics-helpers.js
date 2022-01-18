import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const convertTime = (minutesQuantity) => {
  const minutesInHour = 60;
  const count = minutesQuantity;
  const hours = (count / minutesInHour);
  const roundedHours = Math.floor(hours);
  const minutes = (hours - roundedHours) * minutesInHour;
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
      accumulator[genre] = genre in accumulator ? accumulator[genre]+=1 : 1;
    });


    return accumulator;
  }, {}))
  .sort(([, currentGenreRepeating], [, nextGenreRepeating]) => nextGenreRepeating - currentGenreRepeating)
  .map(([genre, count]) => ({ genre, count }));

export const getTopGenre = (films) => turnGenresToCountMap(films)[0].genre;
