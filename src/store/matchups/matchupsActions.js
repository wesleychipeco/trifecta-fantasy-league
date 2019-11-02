import { createAction } from "redux-starter-kit";
import {
  SAVE_EXISTING_TOTAL_MATCHUPS,
  SAVE_EXISTING_BASKETBALL_MATCHUPS,
  SAVE_EXISTING_BASEBALL_MATCHUPS,
  SAVE_EXISTING_FOOTBALL_MATCHUPS,
  SORT_MATCHUPS,
} from "./matchupsActionTypes";
import {
  returnMongoCollection,
  findFromMongoSaveToRedux,
} from "../../databaseManagement";
import { retrieveSportMatchups } from "../../scrapers/ownerMatchups";

const actions = {
  saveExistingTotalMatchups: createAction(SAVE_EXISTING_TOTAL_MATCHUPS),
  saveExistingBasketballMatchups: createAction(
    SAVE_EXISTING_BASKETBALL_MATCHUPS
  ),
  saveExistingBaseballMatchups: createAction(SAVE_EXISTING_BASEBALL_MATCHUPS),
  saveExistingFootballMatchups: createAction(SAVE_EXISTING_FOOTBALL_MATCHUPS),
  sortMatchups: createAction(SORT_MATCHUPS),
};

const scrapeMatchups = (
  year,
  teamNumber,
  basketballSeasonEnded,
  baseballSeasonEnded,
  footballSeasonEnded
) => {
  return async function(dispatch) {
    const teamNumbersPerSportCollection = returnMongoCollection(
      "teamNumbersPerSport"
    );

    console.log(
      year,
      teamNumber,
      basketballSeasonEnded,
      baseballSeasonEnded,
      footballSeasonEnded
    );
    teamNumbersPerSportCollection
      .find({ year }, { projection: { teamNumbers: 1 } })
      .asArray()
      .then(teamNumbersArray => {
        console.log("temnum", teamNumbersArray);
        console.log("teamnumber", teamNumber, typeof teamNumber);
        console.log("ok", teamNumbersArray[0].teamNumbers);
        const {
          basketball: basketballTeamNumber,
          baseball: baseballTeamNumber,
          football: footballTeamNumber,
        } = teamNumbersArray[0].teamNumbers[teamNumber];

        console.log("basketballSeaonsendde", basketballSeasonEnded);

        if (basketballSeasonEnded) {
          const baseballMatchups = retrieveSportMatchups(
            "baseball",
            year,
            baseballTeamNumber
          );
        }
      });
  };
};

const displayMatchups = (year, teamNumber) => {
  return async function(dispatch) {
    //connect to mongo
    const ownerCollection = returnMongoCollection(
      "owner" + teamNumber + "Matchups"
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

const sortTable = matchups => {
  return async function(dispatch) {
    dispatch(actions.sortMatchups(matchups));
  };
};

export { scrapeMatchups, displayMatchups, sortTable };
