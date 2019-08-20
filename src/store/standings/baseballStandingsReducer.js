import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_BASEBALL_STANDINGS_START,
  SCRAPE_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_BASEBALL_STANDINGS_FAILED,
  SET_LAST_SCRAPED,
} from "./baseballStandingsActionTypes";

const BASEBALL_STANDINGS_STATE_PATH = "baseballStandings";

const initialState = {
  baseballStandingsLoading: false,
  baseballStandingsSuccess: false,
  baseballStandings: "hey",
  lastScraped: "date",
};

const baseballStandingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SCRAPE_BASEBALL_STANDINGS_START:
      return {
        ...state,
        baseballStandingsLoading: true,
        baseballStandingsSuccess: false,
      };
    case SCRAPE_BASEBALL_STANDINGS_SUCCESS: {
      return {
        ...state,
        baseballStandingsLoading: false,
        baseballStandingsSuccess: true,
        baseballStandings: payload,
      };
    }
    case SCRAPE_BASEBALL_STANDINGS_FAILED: {
      return {
        ...state,
        baseballStandingsLoading: false,
        baseballStandingsSuccess: false,
      };
    }
    case SET_LAST_SCRAPED: {
      return {
        ...state,
        lastScraped: payload,
      };
    }
    default:
      return state;
  }
};

const getBaseballStandingsStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, BASEBALL_STANDINGS_STATE_PATH);

  return {
    getBaseballStandings: () => state.baseballStandings,
    getLastScraped: () => state.lastScraped,
  };
};

export { BASEBALL_STANDINGS_STATE_PATH, getBaseballStandingsStateSelectors };

export default baseballStandingsReducer;
