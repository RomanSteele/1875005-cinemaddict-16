import {CARD_DESCRIPTION, POSTERS, TITLES, ACTORS, WRITERS, COUNTRY} from './data.js';
import {generateComment} from './comment.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';


// Случайное значение
const getRandomInteger = (a,b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


// Случайное значение с десятыми для рейтинга
const getRandomFloatInteger = (a = 0, b = 9.9) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  const result = lower + Math.random() * (upper - lower + 1);
  return result.toFixed(1);
};


// Берёт из массива в data.js случайное описание для карточки
const generateDescription = () => {
  const randomIndex = getRandomInteger(0, CARD_DESCRIPTION.length - 1);

  return CARD_DESCRIPTION[randomIndex];
};


//Генерирует булево значение для списков
const generateBooleanForList = () => {
  const isActive = Boolean(getRandomInteger(0, 1));

  if (!isActive) {
    return false;
  }
  return true;
};


//Генерирует постер фильма
const generatePoster = () => {
  const randomIndex = getRandomInteger(0, POSTERS.length - 1);

  return (`images/posters/${POSTERS[randomIndex]}`);
};

// Генерирует случайный жанр
const getRandomGenre = () => {
  const genres = ['Mystery', 'Film-Noir', 'Drama', 'Musical','Horror','Cartoon','Comedy'];
  const randomGenres = genres.slice(getRandomInteger(-7,+7));

  return randomGenres;
};

//Берёт случайное название из массива в data
const generateTitle = () => {
  const randomIndex = getRandomInteger(0, TITLES.length - 1);

  return TITLES[randomIndex];
};

//Случайная страна
const generateCountry = () => {
  const randomIndex = getRandomInteger(0, COUNTRY.length - 1);

  return COUNTRY[randomIndex];
};

//если Already watched - вернёт дату, если нет - вернёт null
const getWatchingDate = (isWatched) => (isWatched ===  true ? dayjs() : null);

//Случайная дата для проверки сортировки
const randomDate =(start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Создаёт данные для карточки
export const generateCard = () => ({
  id: nanoid(),
  title: generateTitle(),
  alternativeTitle: generateTitle(),
  rating: getRandomFloatInteger(),
  imgSource: generatePoster(),
  ageRating: getRandomInteger(1,18),
  director: generateTitle(),
  writers: WRITERS,
  actors: ACTORS,
  release: dayjs(randomDate(new Date(2012, 0, 1), new Date())),
  releaseCountry: generateCountry(),
  duration: getRandomInteger(30,240),
  genres: getRandomGenre(),
  description: generateDescription(),
  comments: Array.from({length:getRandomInteger(1,5)},generateComment),
  inWatchlist: generateBooleanForList(),
  isWatched: generateBooleanForList(),
  isFavourite: generateBooleanForList(),
  watchingDate: getWatchingDate(),
});
