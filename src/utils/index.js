import { round } from "lodash";

export const sum = (array) => array.reduce((acc, n) => acc + n, 0);

export const sortArrayBy = (array, sortKey, sortDirection) =>
  // if sortDirection === true => highToLow
  // if sortDirection === false => lowToHigh
  sortDirection
    ? array.sort((a, b) => (a[sortKey] < b[sortKey] ? 1 : -1))
    : array.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));

export const sortArrayByTop5Bottom5 = (array, sortKey, sortDirection) =>
  // if sortDirection === true => highToLow
  // if sortDirection === false => lowToHigh
  sortDirection
    ? array.sort((a, b) => (a[sortKey].points < b[sortKey].points ? 1 : -1))
    : array.sort((a, b) => (a[sortKey].points > b[sortKey].points ? 1 : -1));

export const sortArrayBySecondaryParameter = (
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

export const isYear1BeforeYear2 = (year, currentYear) =>
  Number(year) < Number(currentYear);

export const isEmptyArray = (array) => array.length === 0;

export const winPerCalculation = (wins, losses, ties) =>
  round((wins + ties / 2) / (wins + losses + ties), 3);
