import { createAction } from "redux-starter-kit";
import { SCRAPE_YEAR_MATCHUPS } from "./commissionerActionTypes";
import {
  deleteInsertDispatch,
  returnMongoCollection,
  findFromMongoSaveToRedux
} from "../../databaseManagement";

const actions = {
  scrapeYearMatchups: createAction(SCRAPE_YEAR_MATCHUPS)
};

const retrieveTeamsInYear = year => {
  const teamNumbersPerSportCollection = returnMongoCollection(
    "teamNumbersPerSport"
  );
  const teamsList = teamNumbersPerSportCollection
    .find({ year }, { projection: { _id: 0 } })
    .asArray()
    .then(docs => {
      return Object.keys(docs[0].teamNumbers);
    });
  return teamsList;
};

const getEachTeamsMatchups = async (teamNumber, year) => {
  console.log("aaaaaaaaaaa", teamNumber);
  const teamMatchupsCollectionName = `owner${teamNumber}Matchups`;
  const teamMatchupsCollection = returnMongoCollection(
    teamMatchupsCollectionName
  );
  return teamMatchupsCollection
    .find({ $or: [{ year: "all" }, { year }] })
    .asArray()
    .then(docs => {
      console.log("docs", docs);
      return docs;
    });
};

const retrieveYearMatchups = year => {
  return async function(dispatch) {
    const teamsList = await retrieveTeamsInYear(year);

    for (const teamNumber of teamsList) {
      const ok = await getEachTeamsMatchups(teamNumber);
      console.log("ok", ok);
    }
  };
};

export { retrieveYearMatchups };
