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
  deleteAndInsert,
  findAndSaveToRedux,
} from "../../databaseManagement";

const actions = {
  saveExistingTotalMatchups: createAction(SAVE_EXISTING_TOTAL_MATCHUPS),
  saveExistingBasketballMatchups: createAction(
    SAVE_EXISTING_BASKETBALL_MATCHUPS
  ),
  saveExistingBaseballMatchups: createAction(SAVE_EXISTING_BASEBALL_MATCHUPS),
  saveExistingFootballMatchups: createAction(SAVE_EXISTING_FOOTBALL_MATCHUPS),
  sortMatchups: createAction(SORT_MATCHUPS),
};

const displayMatchups = (year, ownerNumber) => {
  return async function(dispatch) {
    //connect to mongo
    const ownerCollection = returnMongoCollection(
      "owner" + ownerNumber + "Matchups" + year
    );

    findAndSaveToRedux(
      dispatch,
      actions.saveExistingTotalMatchups,
      ownerCollection,
      "totalWinPer",
      "totalMatchups"
    );
    findAndSaveToRedux(
      dispatch,
      actions.saveExistingBasketballMatchups,
      ownerCollection,
      "winPer",
      "basketballMatchups"
    );
    findAndSaveToRedux(
      dispatch,
      actions.saveExistingBaseballMatchups,
      ownerCollection,
      "winPer",
      "baseballMatchups"
    );
    findAndSaveToRedux(
      dispatch,
      actions.saveExistingFootballMatchups,
      ownerCollection,
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

export { displayMatchups, sortTable };
