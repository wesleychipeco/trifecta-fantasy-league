import { getStateSlice } from "../reduxUtils";
import {
  GET_BASKETBALL_ALL_TIME_RECORDS,
  GET_BASKETBALL_PAST_CHAMPIONS,
  GET_BASKETBALL_BEST_H2H,
  GET_BASKETBALL_BEST_ROTO,
  SORT_BASKETBALL_HALL_OF_FAME,
} from "./hallOfFameActionTypes";

const BASKETBALL_HALL_OF_FAME_STATE_PATH = "basketballHallOfFame";

const initialState = {
  sport: "",
  allTimeRecords: [],
  pastChampions: [],
  bestH2H: [],
  bestRoto: [],
};

const basketballHallOfFameReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BASKETBALL_ALL_TIME_RECORDS:
      return {
        ...state,
        allTimeRecords: payload,
      };
    case GET_BASKETBALL_PAST_CHAMPIONS:
      return {
        ...state,
        pastChampions: payload,
      };
    case GET_BASKETBALL_BEST_H2H:
      return {
        ...state,
        bestH2H: payload,
      };
    case GET_BASKETBALL_BEST_ROTO:
      return {
        ...state,
        bestRoto: payload,
      };
    case SORT_BASKETBALL_HALL_OF_FAME:
      const [standings, tableType] = payload;
      return {
        ...state,
        [tableType]: standings,
      };
    default:
      return state;
  }
};

const getBasketballHallOfFameStateSelectors = function (rootState) {
  const state = getStateSlice(rootState, BASKETBALL_HALL_OF_FAME_STATE_PATH);

  return {
    getSport: () => state.sport,
    getAllTimeRecords: () => state.allTimeRecords,
    getPastChampions: () => state.pastChampions,
    getBestH2H: () => state.bestH2H,
    getBestRoto: () => state.bestRoto,
  };
};

export {
  BASKETBALL_HALL_OF_FAME_STATE_PATH,
  getBasketballHallOfFameStateSelectors,
};

export default basketballHallOfFameReducer;
