import { sum } from "../utils";

const sumBaseballRotoPoints = (dataArray, sumKey) => {
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

const sumBasketballRotoPoints = (dataArray, sumKey) => {
  dataArray.forEach(team => {
    const filteredStandings = (({
      FGPERPoints,
      FTPERPoints,
      THREEPMPoints,
      REBPoints,
      ASTPoints,
      STLPoints,
      BLKPoints,
      TOPoints,
      PTSPoints,
    }) => ({
      FGPERPoints,
      FTPERPoints,
      THREEPMPoints,
      REBPoints,
      ASTPoints,
      STLPoints,
      BLKPoints,
      TOPoints,
      PTSPoints,
    }))(team);

    team[sumKey] = sum(Object.values(filteredStandings));
  });
  return dataArray;
};

export { sumBaseballRotoPoints, sumBasketballRotoPoints };
