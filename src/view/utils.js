////Приводит минуты к формату
const shiftDurationToHours = (timeInMinutes) => {
  const minutesInHour = 60;
  const hours = Math.trunc(timeInMinutes/minutesInHour);
  const minutes = timeInMinutes % minutesInHour;
  return `${hours  }h ${  minutes  }m`;
};

export {shiftDurationToHours};
