import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import SmartView from './smart-view.js';
import { StatisticsType } from '../utils/const.js';
import { turnGenresToCountMap, getFilmsDuration, getTopGenre, convertTime} from '../utils/statistics-helpers.js';

const BAR_HEIGHT = 50;

const renderFilters = (filters, currentFilter) => filters.map((filter) => {
  const filterLabel = (filter.charAt(0).toUpperCase() + filter.slice(1)).split('-').join(' ');
  const isChecked = filter === currentFilter;

  return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${isChecked ? 'checked' : ''}>
      <label for="statistic-${filter}" class="statistic__filters-label">${filterLabel}</label>`;
}).join('');

const renderChart = (statisticCtx, genres) => {
  const genresNames = genres.map(({ genre }) => genre);
  const genresDigits = genres.map(({ count }) => count);


  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresNames,
      datasets: [{
        data: genresDigits,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};
const createStatisticsTemplate = (data, currentFilter, userRank) => {
  const { watchedFilmsCount, watchedFilmsDurationHours, watchedFilmsDurationMinutes, watchedFilmsTopGenre } = data;

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${renderFilters(Object.values(StatisticsType), currentFilter)}
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${watchedFilmsDurationHours} <span class="statistic__item-description">h</span> ${watchedFilmsDurationMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${watchedFilmsTopGenre}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class StatisticsView extends SmartView {
  #films = null;
  #chart = null;
  #currentFilter = StatisticsType.ALL_TIME;
  #userRank = null;

  constructor(films, userRank) {
    super();
    this.#films = films.filter((film) => film.isWatched);
    this.#userRank = userRank;

    this._data = this.#parseWatchedFilmsToData(this.#films);

    this.#setFilterTypeChangeHandler();
    this.#setChart();
  }

  get films() {
    const currentDate = dayjs();
    switch (this.#currentFilter) {
      case StatisticsType.TODAY:
        return this.#films.filter((film) => currentDate.diff(dayjs(film.watchingDate), 'day') === 0);
      case StatisticsType.WEEK:
        return this.#films.filter((film) => currentDate.diff(dayjs(film.watchingDate), 'week') === 0);
      case StatisticsType.MONTH:
        return this.#films.filter((film) => currentDate.diff(dayjs(film.watchingDate), 'month') === 0);
      case StatisticsType.YEAR:
        return this.#films.filter((film) => currentDate.diff(dayjs(film.watchingDate), 'year') === 0);
      default:
        return this.#films;
    }
  }

  get template() {
    return createStatisticsTemplate(this._data, this.#currentFilter, this.#userRank);
  }


  #setFilterTypeChangeHandler = () => {
    this.element.querySelector('.statistic__filters').addEventListener('change', this.#onFiltersChange);
  };

  #setChart = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');
    this.#chart = renderChart(statisticCtx, turnGenresToCountMap(this.films));
  };


  restoreHandlers = () => {
    this.#setFilterTypeChangeHandler();
  };


  #parseWatchedFilmsToData = (watchedFilms) => {
    const watchedFilmsCount = watchedFilms.length;
    const watchedFilmsDurationHours = watchedFilmsCount ? convertTime(getFilmsDuration(watchedFilms)).roundedHours : '0';
    const watchedFilmsDurationMinutes = watchedFilmsCount ? convertTime(getFilmsDuration(watchedFilms)).roundedMinutes : '0';
    const watchedFilmsTopGenre = watchedFilmsCount ? getTopGenre(watchedFilms)  : '';

    return {
      watchedFilmsCount,
      watchedFilmsDurationHours,
      watchedFilmsDurationMinutes,
      watchedFilmsTopGenre
    };
  };


  #onFiltersChange = (evt) => {
    this.#currentFilter = evt.target.value;
    this.updateData(this.#parseWatchedFilmsToData(this.films));

    this.#setChart();
  };

}
