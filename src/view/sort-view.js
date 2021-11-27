const createSortButton = (title, isActive) => {
  const activeClass = isActive ? 'sort__button--active' : '';
  return (
    `<li><a href="#" class="sort__button ${activeClass}">${title}</a></li>`
  );
};

export const createSortButtonsTemplate = () =>(
  `<ul class="sort">
    ${createSortButton('Sort by default',false)}
    ${createSortButton('Sort by date',true)}
    ${createSortButton('Sort by rating',false)}
  </ul>`
);
