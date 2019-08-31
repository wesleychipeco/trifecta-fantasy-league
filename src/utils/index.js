const sum = array => array.reduce((acc, n) => acc + n, 0);

const sortBy = (array, sortKey, sortDirection) =>
  sortDirection === "highToLow"
    ? array.sort((a, b) => (a[sortKey] < b[sortKey] ? 1 : -1))
    : array.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));

export { sum, sortBy };
