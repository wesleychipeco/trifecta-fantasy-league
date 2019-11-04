import { getStateSlice } from "../reduxUtils";
import {
  SAVE_SCRAPED_TOTAL_MATCHUPS,
  SAVE_SCRAPED_BASKETBALL_MATCHUPS,
  SAVE_SCRAPED_BASEBALL_MATCHUPS,
  SAVE_SCRAPED_FOOTBALL_MATCHUPS,
  SAVE_EXISTING_TOTAL_MATCHUPS,
  SAVE_EXISTING_BASKETBALL_MATCHUPS,
  SAVE_EXISTING_BASEBALL_MATCHUPS,
  SAVE_EXISTING_FOOTBALL_MATCHUPS,
  SORT_MATCHUPS,
  SET_MATCHUPS_LAST_SCRAPED,
} from "./matchupsActionTypes";
import { filterIdField } from "../../databaseManagement";

const MATCHUPS_STATE_PATCH = "matchups";

const initialState = {
  totalMatchups: [],
  basketballMatchups: [],
  baseballMatchups: [],
  footballMatchups: [],
  lastScraped: null,
};

const matchupsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  let filteredPayload;
  switch (type) {
    case SAVE_SCRAPED_TOTAL_MATCHUPS:
      filteredPayload = filterIdField(payload);
      return {
        ...state,
        totalMatchups: filteredPayload,
      };
    case SAVE_SCRAPED_BASKETBALL_MATCHUPS:
      filteredPayload = filterIdField(payload);
      return {
        ...state,
        basketballMatchups: filteredPayload,
      };
    case SAVE_SCRAPED_BASEBALL_MATCHUPS:
      filteredPayload = filterIdField(payload);
      return {
        ...state,
        baseballMatchups: filteredPayload,
      };
    case SAVE_SCRAPED_FOOTBALL_MATCHUPS:
      filteredPayload = filterIdField(payload);
      return {
        ...state,
        footballMatchups: filteredPayload,
      };
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
    case SET_MATCHUPS_LAST_SCRAPED:
      return {
        ...state,
        lastScraped: payload,
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
    getLastScraped: () => state.lastScraped,
  };
};

export { MATCHUPS_STATE_PATCH, getMatchupsStateSelectors };

export default matchupsReducer;
