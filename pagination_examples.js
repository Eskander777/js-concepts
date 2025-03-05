const MONTHS_IN_PAGE = 3;
const months = ["Jan", "Feb"];

function makePages(items, itemsNum = 2) {
  let prevIdx = 0;
  const itemsPages = [];

  for (let index = 1; index <= items.length; index++) {
    if (index % itemsNum != 0 && index != items.length) continue;

    const itemsPage = months.slice(prevIdx, index);
    itemsPages.push(itemsPage);
    prevIdx = index;
  }

  return itemsPages;
}

