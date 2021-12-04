////Приводит минуты к формату
const MINUTES_IN_HOURS = 60;

const shiftDurationToHours = (timeInMinutes) => {
  const hours = Math.trunc(timeInMinutes/MINUTES_IN_HOURS);
  const minutes = timeInMinutes % MINUTES_IN_HOURS;
  return `${hours  }h ${  minutes  }m`;
};

export {shiftDurationToHours};
