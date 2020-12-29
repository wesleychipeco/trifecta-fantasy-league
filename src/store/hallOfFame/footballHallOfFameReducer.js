import { getStateSlice } from "../reduxUtils";
import {
  GET_FOOTBALL_ALL_TIME_RECORDS,
  GET_FOOTBALL_PAST_CHAMPIONS,
  GET_FOOTBALL_BEST_H2H,
  GET_FOOTBALL_BEST_WEEKS,
  SORT_FOOTBALL_HALL_OF_FAME,
} from "./hallOfFameActionTypes";

const FOOTBALL_HALL_OF_FAME_STATE_PATH = "footballHallOfFame";

const initialState = {
  sport: "",
  allTimeRecords: [],
  pastChampions: [],
  bestH2H: [],
  bestWeeks: [],
};

const footballHallOfFameReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_FOOTBALL_ALL_TIME_RECORDS:
      return {
        ...state,
        allTimeRecords: payload,
      };
    case GET_FOOTBALL_PAST_CHAMPIONS:
      return {
        ...state,
        pastChampions: payload,
      };
    case GET_FOOTBALL_BEST_H2H:
      return {
        ...state,
        bestH2H: payload,
      };
    case GET_FOOTBALL_BEST_WEEKS:
      return {
        ...state,
        bestWeeks: payload,
      };
    case SORT_FOOTBALL_HALL_OF_FAME:
      const [standings, tableType] = payload;
      return {
        ...state,
        [tableType]: standings,
      };
    default:
      return state;
  }
};

const getFootballHallOfFameStateSelectors = function (rootState) {
  const state = getStateSlice(rootState, FOOTBALL_HALL_OF_FAME_STATE_PATH);

  return {
    getSport: () => state.sport,
    getAllTimeRecords: () => state.allTimeRecords,
    getPastChampions: () => state.pastChampions,
    getBestH2H: () => state.bestH2H,
    getBestWeeks: () => state.bestWeeks,
  };
};

export {
  FOOTBALL_HALL_OF_FAME_STATE_PATH,
  getFootballHallOfFameStateSelectors,
};

export default footballHallOfFameReducer;
