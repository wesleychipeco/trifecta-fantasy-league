const sum = array => array.reduce((acc, n) => acc + n, 0);

const sortArrayBy = (array, sortKey, sortDirection) =>
  // if sortDirection === true => highToLow
  // if sortDirection === false => lowToHigh
  sortDirection
    ? array.sort((a, b) => (a[sortKey] < b[sortKey] ? 1 : -1))
    : array.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));

const sortArrayBySecondaryParameter = (
  array,
  primarySortKey,
  secondarySortKey
) =>
  // Only for both going from high to low
  array.sort((a, b) =>
    a[primarySortKey] < b[primarySortKey]
      ? 1
      : a[primarySortKey] === b[primarySortKey]
      ? a[secondarySortKey] < b[secondarySortKey]
        ? 1
        : -1
      : -1
  );

const isYear1BeforeYear2 = (year, currentYear) =>
  Number(year) < Number(currentYear);

export { sum, sortArrayBy, sortArrayBySecondaryParameter, isYear1BeforeYear2 };
