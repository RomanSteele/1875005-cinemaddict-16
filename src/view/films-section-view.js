const filmsTitle = (title) => (
  `<h2 class="films-list__title visually-hidden">${title}</h2>`
);


export const filmsSectionTemplate = () => (
  `<section class="films">
    <section class="films-list">
    ${filmsTitle('All movies. Upcoming')}
    </section>
</section>`);


