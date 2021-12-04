import { createAction } from "redux-starter-kit";
import {
  SAVE_SCRAPED_BASKETBALL_MATCHUPS,
  SAVE_SCRAPED_BASEBALL_MATCHUPS,
  SAVE_SCRAPED_FOOTBALL_MATCHUPS,
  SAVE_SCRAPED_TOTAL_MATCHUPS,
  SAVE_EXISTING_TOTAL_MATCHUPS,
  SAVE_EXISTING_BASKETBALL_MATCHUPS,
  SAVE_EXISTING_BASEBALL_MATCHUPS,
  SAVE_EXISTING_FOOTBALL_MATCHUPS,
  SORT_MATCHUPS,
  SET_MATCHUPS_LAST_SCRAPED,
} from "./matchupsActionTypes";
import {
  returnMongoCollection,
  findFromMongoSaveToRedux,
  deleteInsertDispatch,
} from "../../databaseManagement";
// import { basketballMatchups2019 } from "../../dataJSONS/basketballMatchups2019";
import { format } from "date-fns";
import {
  determineBaseballMatchups,
  determineBasketballMatchups,
  determineFootballMatchups,
  determineTotalMatchups,
} from "./calculateSportMatchups";

const actions = {
  saveScrapedTotalMatchups: createAction(SAVE_SCRAPED_TOTAL_MATCHUPS),
  saveScrapedBasketballMatchups: createAction(SAVE_SCRAPED_BASKETBALL_MATCHUPS),
  saveScrapedBaseballMatchups: createAction(SAVE_SCRAPED_BASEBALL_MATCHUPS),
  saveScrapedFootballMatchups: createAction(SAVE_SCRAPED_FOOTBALL_MATCHUPS),
  saveExistingTotalMatchups: createAction(SAVE_EXISTING_TOTAL_MATCHUPS),
  saveExistingBasketballMatchups: createAction(
    SAVE_EXISTING_BASKETBALL_MATCHUPS
  ),
  saveExistingBaseballMatchups: createAction(SAVE_EXISTING_BASEBALL_MATCHUPS),
  saveExistingFootballMatchups: createAction(SAVE_EXISTING_FOOTBALL_MATCHUPS),
  sortMatchups: createAction(SORT_MATCHUPS),
  setLastScraped: createAction(SET_MATCHUPS_LAST_SCRAPED),
};

const scrapeMatchups = (year) => {
  return async function (dispatch) {
    dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:mm:")));
    // connect to mongo
    const seasonVariablesCollection = await returnMongoCollection(
      "seasonVariables"
    );
    const seasonVars = await seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray();

    const {
      basketball: basketballSeasonVars,
      baseball: baseballSeasonVars,
      football: footballSeasonVars,
    } = seasonVars[0];
    if (
      !basketballSeasonVars.seasonStarted ||
      !baseballSeasonVars.seasonStarted ||
      !footballSeasonVars.seasonStarted ||
      basketballSeasonVars.inSeason ||
      baseballSeasonVars.inSeason ||
      footballSeasonVars.inSeason
    ) {
      if (
        !window.confirm(
          "Not all sports have been fully started and completed. Are you sure you want to continue scraping matchups?"
        )
      ) {
        alert("Did not scrape");
        return;
      }
    }

    const teamNumbersOwnerNamesCollection = returnMongoCollection(
      "ownersTeamNumbersList"
    );
    const teamNumbersOwnerNamesRaw = await teamNumbersOwnerNamesCollection
      .find({})
      .asArray();
    const teamNumbersOwnerNames = teamNumbersOwnerNamesRaw[0];

    const teamNumbersPerSportCollection = returnMongoCollection(
      "teamNumbersPerSport"
    );
    const teamNumbersPerSportRaw = await teamNumbersPerSportCollection
      .find({ year }, { projection: { id: 0, year: 0 } })
      .asArray();
    const teamNumbersPerSport = teamNumbersPerSportRaw[0];

    const trifectaNumbersList = Object.keys(teamNumbersPerSport.teamNumbers);

    // creates each sport's base matchups object
    const createSportMatchupsObject = (sport) => {
      const sportMatchupObject = {};
      const defaultMatchupsData =
        sport === "football"
          ? {
              wins: 0,
              losses: 0,
              ties: 0,
              winPer: 0,
              pointsFor: 0,
              pointsAgainst: 0,
              pointsDiff: 0,
            }
          : {
              wins: 0,
              losses: 0,
              ties: 0,
              winPer: 0,
            };

      // outer loop to add ownernames and matchups object per trifecta number
      for (let i = 0; i < trifectaNumbersList.length; i++) {
        const ownerNumber = trifectaNumbersList[i];
        sportMatchupObject[ownerNumber] = {
          ownerNames: teamNumbersOwnerNames[ownerNumber].ownerNames,
          matchups: {},
        };
        // inner loop for each other trifecta number adding default matchups data
        for (let j = 0; j < trifectaNumbersList.length; j++) {
          if (i != j) {
            const innerOwnerNumber = trifectaNumbersList[j];
            sportMatchupObject[ownerNumber].matchups[innerOwnerNumber] = {
              ...defaultMatchupsData,
              ownerNames: teamNumbersOwnerNames[innerOwnerNumber].ownerNames,
            };
          }
        }
      }
      return sportMatchupObject;
    };

    // creates sport to trifecta numbers mapping object
    const createSportNumbersMappingObject = (sport) => {
      const sportNumbersMappingObject = {};
      for (let i = 0; i < trifectaNumbersList.length; i++) {
        const trifectaNumber = trifectaNumbersList[i];
        const sportTeamNumber =
          teamNumbersPerSport.teamNumbers[trifectaNumber][sport];
        sportNumbersMappingObject[sportTeamNumber] = trifectaNumber;
      }
      return sportNumbersMappingObject;
    };

    const basketball = await determineBasketballMatchups(
      year,
      createSportMatchupsObject,
      createSportNumbersMappingObject
    );

    const baseball = await determineBaseballMatchups(
      year,
      createSportMatchupsObject,
      createSportNumbersMappingObject
    );

    const football = await determineFootballMatchups(
      year,
      createSportMatchupsObject,
      createSportNumbersMappingObject
    );

    const allTrifectaMatchupsObject = {
      basketball,
      baseball,
      football,
    };
    console.log("master trifecta matchups object", allTrifectaMatchupsObject);

    // loop through all trifecta numbers and make each owner's own matchups object and upload to that owner's mongodb
    for (let x = 0; x < trifectaNumbersList.length; x++) {
      const trifectaNumber = trifectaNumbersList[x];
      const eachTotalMatchupsObject = await determineTotalMatchups(
        year,
        trifectaNumber,
        basketball,
        baseball,
        football
      );
      console.log(
        `each total matchups object for trifecta owner number: ${trifectaNumber}!`,
        eachTotalMatchupsObject
      );

      // connect to mongo
      const ownerMatchupsCollection = await returnMongoCollection(
        `owner${trifectaNumber}Matchups`
      );
      deleteInsertDispatch(
        null,
        null,
        ownerMatchupsCollection,
        year,
        eachTotalMatchupsObject,
        null,
        false
      );
    }
  };
};

const displayMatchups = (year, teamNumber) => {
  return async function (dispatch) {
    //connect to mongo
    const ownerCollection = await returnMongoCollection(
      `owner${teamNumber}Matchups`
    );

    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingTotalMatchups,
      ownerCollection,
      year,
      "totalWinPer",
      "totalMatchups"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingBasketballMatchups,
      ownerCollection,
      year,
      "winPer",
      "basketballMatchups"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingBaseballMatchups,
      ownerCollection,
      year,
      "winPer",
      "baseballMatchups"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingFootballMatchups,
      ownerCollection,
      year,
      "winPer",
      "footballMatchups"
    );
  };
};

const sortTable = (matchups) => {
  return async function (dispatch) {
    dispatch(actions.sortMatchups(matchups));
  };
};

export { scrapeMatchups, displayMatchups, sortTable };
