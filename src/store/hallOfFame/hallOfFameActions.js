import { createAction } from "redux-starter-kit";
import {
  GET_BASKETBALL_ALL_TIME_RECORDS,
  GET_BASKETBALL_PAST_CHAMPIONS,
  GET_BASKETBALL_BEST_H2H,
  GET_BASKETBALL_BEST_ROTO,
  SORT_BASKETBALL_HALL_OF_FAME,
  GET_BASEBALL_ALL_TIME_RECORDS,
  GET_BASEBALL_PAST_CHAMPIONS,
  GET_BASEBALL_BEST_H2H,
  GET_BASEBALL_BEST_ROTO,
  SORT_BASEBALL_HALL_OF_FAME,
  GET_FOOTBALL_ALL_TIME_RECORDS,
  GET_FOOTBALL_PAST_CHAMPIONS,
  GET_FOOTBALL_BEST_H2H,
  GET_FOOTBALL_BEST_WEEKS,
  SORT_FOOTBALL_HALL_OF_FAME,
} from "./hallOfFameActionTypes";
import { returnMongoCollection } from "../../databaseManagement";
import { sortArrayBy } from "../../utils";

const actions = {
  basketball: {
    allTimeRecords: createAction(GET_BASKETBALL_ALL_TIME_RECORDS),
    pastChampions: createAction(GET_BASKETBALL_PAST_CHAMPIONS),
    bestH2H: createAction(GET_BASKETBALL_BEST_H2H),
    bestRoto: createAction(GET_BASKETBALL_BEST_ROTO),
  },
  baseball: {
    allTimeRecords: createAction(GET_BASEBALL_ALL_TIME_RECORDS),
    pastChampions: createAction(GET_BASEBALL_PAST_CHAMPIONS),
    bestH2H: createAction(GET_BASEBALL_BEST_H2H),
    bestRoto: createAction(GET_BASEBALL_BEST_ROTO),
  },
  football: {
    allTimeRecords: createAction(GET_FOOTBALL_ALL_TIME_RECORDS),
    pastChampions: createAction(GET_FOOTBALL_PAST_CHAMPIONS),
    bestH2H: createAction(GET_FOOTBALL_BEST_H2H),
    bestWeeks: createAction(GET_FOOTBALL_BEST_WEEKS),
  },
};
const sortBasketball = createAction(SORT_BASKETBALL_HALL_OF_FAME);
const sortBaseball = createAction(SORT_BASEBALL_HALL_OF_FAME);
const sortFootball = createAction(SORT_FOOTBALL_HALL_OF_FAME);

const displayHallOfFame = (sport) => {
  return async function (dispatch) {
    const hallOfFameCollection = returnMongoCollection("hallOfFame");

    hallOfFameCollection
      .find({ sport }, { projection: { _id: 0 } })
      .asArray()
      .then((docs) => {
        const extractedObject = docs[0];
        const sportActions = actions[sport];
        const {
          allTimeRecords,
          pastChampions,
          bestH2H,
          bestRoto,
          bestWeeks,
        } = extractedObject;
        dispatch(
          sportActions.allTimeRecords(
            sortArrayBy(allTimeRecords, "winPer", true)
          )
        );
        dispatch(
          sportActions.pastChampions(sortArrayBy(pastChampions, "year", false))
        );
        dispatch(sportActions.bestH2H(sortArrayBy(bestH2H, "winPer", true)));
        if (sport === "football") {
          dispatch(
            sportActions.bestWeeks(sortArrayBy(bestWeeks, "pointsFor", true))
          );
        } else {
          dispatch(
            sportActions.bestRoto(sortArrayBy(bestRoto, "rotoPoints", true))
          );
        }
      });
  };
};

const sortBasketballTable = (table) => {
  return async function (dispatch) {
    dispatch(sortBasketball(table));
  };
};

const sortBaseballTable = (table) => {
  return async function (dispatch) {
    dispatch(sortBaseball(table));
  };
};

const sortFootballTable = (table) => {
  return async function (dispatch) {
    dispatch(sortFootball(table));
  };
};

export {
  displayHallOfFame,
  sortBasketballTable,
  sortBaseballTable,
  sortFootballTable,
};
