const sum = array => array.reduce((acc, n) => acc + n, 0);

const sortArrayBy = (array, sortKey, sortDirection) =>
  // if sortDirection === true => highToLow
  // if sortDirection === false => lowToHigh
  sortDirection
    ? array.sort((a, b) => (a[sortKey] < b[sortKey] ? 1 : -1))
    : array.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));

const isYearInPast = (year, currentYear) => Number(year) < Number(currentYear);

export { sum, sortArrayBy, isYearInPast };
