import { getStateSlice } from "../reduxUtils";
import {
  SAVE_EXISTING_TOTAL_MATCHUPS,
  SAVE_EXISTING_BASKETBALL_MATCHUPS,
  SAVE_EXISTING_BASEBALL_MATCHUPS,
  SAVE_EXISTING_FOOTBALL_MATCHUPS,
  SORT_MATCHUPS,
} from "./matchupsActionTypes";

const MATCHUPS_STATE_PATCH = "matchups";

const initialState = {
  totalMatchups: [],
  basketallMatchups: [],
  baseballMatchups: [],
  footballMatchups: [],
};

const matchupsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SAVE_EXISTING_TOTAL_MATCHUPS:
      return {
        ...state,
        totalMatchups: payload,
      };
    case SAVE_EXISTING_BASKETBALL_MATCHUPS:
      return {
        ...state,
        basketballMatchups: payload,
      };
    case SAVE_EXISTING_BASEBALL_MATCHUPS:
      return {
        ...state,
        baseballMatchups: payload,
      };
    case SAVE_EXISTING_FOOTBALL_MATCHUPS:
      return {
        ...state,
        footballMatchups: payload,
      };
    case SORT_MATCHUPS:
      const [matchups, tableType] = payload;
      return {
        ...state,
        [tableType]: matchups,
      };
    default:
      return state;
  }
};

const getMatchupsStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, MATCHUPS_STATE_PATCH);

  return {
    getTotalMatchups: () => state.totalMatchups,
    getBasketballMatchups: () => state.basketballMatchups,
    getBaseballMatchups: () => state.baseballMatchups,
    getFootballMatchups: () => state.footballMatchups,
  };
};

export { MATCHUPS_STATE_PATCH, getMatchupsStateSelectors };

export default matchupsReducer;
