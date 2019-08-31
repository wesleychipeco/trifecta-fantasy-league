const sumTrifectaPoints = dataArray => {
  dataArray.forEach(team => {
    dataArray.totalTrifectaPoints =
      team.h2hTrifectaPoints + team.rotoTrifectaPoints;
  });
  return dataArray;
};

export { sumTrifectaPoints };
