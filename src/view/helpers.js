////Приводит минуты к формату
const MINUTES_IN_HOURS = 60;

export const shiftDurationToHours = (timeInMinutes) => {
  const hours = Math.trunc(timeInMinutes/MINUTES_IN_HOURS);
  const minutes = timeInMinutes % MINUTES_IN_HOURS;
  return `${hours  }h ${  minutes  }m`;
};

// Для сортировки
export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

//Эмодзи
export const COMMENTS_EMOJI = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];
