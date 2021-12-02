import {CARD_DESCRIPTION, POSTERS, TITLES,} from './data.js';
import {generateComment} from './comment.js';


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

//Генерирует продолжительность фильма
const generateDuration = () => (`${getRandomInteger(0,24)  }h ${  getRandomInteger(0,59)  }m`);


//Генерирует постер фильма
const generatePoster = () => {
  const randomIndex = getRandomInteger(0, POSTERS.length - 1);

  return (`./images/posters/${POSTERS[randomIndex]}`);
};

// Генерирует случайный жанр
const getRandomGenre = () => {
  const genres = ['Mystery', 'Film-Noir', 'Drama', 'Musical'];
  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

//Берёт случайное название из массива в data
const generateTitle = () => {
  const randomIndex = getRandomInteger(0, TITLES.length - 1);

  return TITLES[randomIndex];
};


// Создаёт данные для карточки
export const generateCard = () => ({
  title: generateTitle(),
  alternativeTitle: generateTitle(),
  rating: getRandomFloatInteger(),
  imgSource: generatePoster(),
  ageRating: getRandomInteger(1,18),
  director: generateTitle(),
  writers: generateTitle(),
  actors: generateTitle(),
  release: getRandomInteger(1896,2021),
  year: getRandomInteger(1896,2021),
  duration: generateDuration(),
  genre: getRandomGenre(),
  alt: generateTitle(),
  description: generateDescription(),
  comments: Array.from({length:getRandomInteger(1,5)},generateComment),
  inWatchlist: generateBooleanForList(),
  isWatched: generateBooleanForList(),
  isFavourite: generateBooleanForList(),
  watchingDate: '',
});
