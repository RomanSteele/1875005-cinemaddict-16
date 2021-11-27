const createSortButton = (title, isActive = false) => {
  const activeClass = isActive ? 'sort__button--active' : '';
  return (
    `<li><a href="#" class="sort__button ${activeClass}">${title}</a></li>`
  );
};

export const createSortButtonsTemplate = () =>(
  `<ul class="sort">
    ${createSortButton('Sort by default')}
    ${createSortButton('Sort by date')}
    ${createSortButton('Sort by rating')}
  </ul>`
);
