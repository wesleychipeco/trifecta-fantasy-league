import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_BASEBALL_STANDINGS,
  SET_LAST_SCRAPED,
} from "./baseballStandingsActionTypes";

const BASEBALL_STANDINGS_STATE_PATH = "baseballStandings";

const initialState = {
  baseballStandings: {},
  lastScraped: "",
};

const baseballStandingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SCRAPE_BASEBALL_STANDINGS: {
      return {
        ...state,
        baseballStandings: payload,
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
