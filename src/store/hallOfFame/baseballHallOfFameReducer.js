import { getStateSlice } from "../reduxUtils";
import {
  GET_BASEBALL_ALL_TIME_RECORDS,
  GET_BASEBALL_PAST_CHAMPIONS,
  GET_BASEBALL_BEST_H2H,
  GET_BASEBALL_BEST_ROTO,
  SORT_BASEBALL_HALL_OF_FAME,
} from "./hallOfFameActionTypes";

const BASEBALL_HALL_OF_FAME_STATE_PATH = "baseballHallOfFame";

const initialState = {
  sport: "",
  allTimeRecords: [],
  pastChampions: [],
  bestH2H: [],
  bestRoto: [],
};

const baseballHallOfFameReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BASEBALL_ALL_TIME_RECORDS:
      return {
        ...state,
        allTimeRecords: payload,
      };
    case GET_BASEBALL_PAST_CHAMPIONS:
      return {
        ...state,
        pastChampions: payload,
      };
    case GET_BASEBALL_BEST_H2H:
      return {
        ...state,
        bestH2H: payload,
      };
    case GET_BASEBALL_BEST_ROTO:
      return {
        ...state,
        bestRoto: payload,
      };
    case SORT_BASEBALL_HALL_OF_FAME:
      const [standings, tableType] = payload;
      return {
        ...state,
        [tableType]: standings,
      };
    default:
      return state;
  }
};

const getBaseballHallOfFameStateSelectors = function (rootState) {
  const state = getStateSlice(rootState, BASEBALL_HALL_OF_FAME_STATE_PATH);

  return {
    getSport: () => state.sport,
    getAllTimeRecords: () => state.allTimeRecords,
    getPastChampions: () => state.pastChampions,
    getBestH2H: () => state.bestH2H,
    getBestRoto: () => state.bestRoto,
  };
};

export {
  BASEBALL_HALL_OF_FAME_STATE_PATH,
  getBaseballHallOfFameStateSelectors,
};

export default baseballHallOfFameReducer;
