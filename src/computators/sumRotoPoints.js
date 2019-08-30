import { sum } from "../utils";

const sumRotoPoints = (dataArray, sumKey) => {
  dataArray.forEach(team => {
    const filteredStandings = (({
      RPoints,
      HRPoints,
      RBIPoints,
      KPoints,
      SBPoints,
      OBPPoints,
      SOPoints,
      QSPoints,
      WPoints,
      SVPoints,
      ERAPoints,
      WHIPPoints,
    }) => ({
      RPoints,
      HRPoints,
      RBIPoints,
      KPoints,
      SBPoints,
      OBPPoints,
      SOPoints,
      QSPoints,
      WPoints,
      SVPoints,
      ERAPoints,
      WHIPPoints,
    }))(team);

    team[sumKey] = sum(Object.values(filteredStandings));
  });
  return dataArray;
};

export { sumRotoPoints };
