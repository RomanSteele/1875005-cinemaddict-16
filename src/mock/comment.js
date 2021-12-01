import { COMMENTS_NAMES, COMMENTS_TEXT, COMMENTS_EMOJI} from './data.js';
import dayjs from 'dayjs';

//Случайное число из диапазона
const getRandomInteger = (a,b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

//Создает значение эмодзи
const generateCommentEmoji = () => {
  const randomIndex = getRandomInteger(0, COMMENTS_EMOJI.length - 1);

  return COMMENTS_EMOJI[randomIndex];
};

//Создаёт имя комментатора
const generateCommentUsername = () => {
  const randomIndex = getRandomInteger(0, COMMENTS_NAMES.length - 1);

  return COMMENTS_NAMES[randomIndex];
};


//Создает текст комментария
const generateCommentText = () => {
  const randomIndex = getRandomInteger(0, COMMENTS_TEXT.length - 1);

  return COMMENTS_TEXT[randomIndex];
};

//Генерирует дату
const generateDate = () => {
  const maxDaysGap = 15;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

//Создает комментарий
export const generateComment = () => ({
  text: generateCommentText(),
  author: generateCommentUsername(),
  date: generateDate(),
  emotion: generateCommentEmoji(),
});
