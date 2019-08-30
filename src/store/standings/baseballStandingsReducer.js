import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_H2H_BASEBALL_STANDINGS_START,
  SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_H2H_BASEBALL_STANDINGS_FAILED,
  ADD_H2H_TRIFECTA_POINTS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_START,
  SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED,
  ADD_ROTO_TRIFECTA_POINTS,
  ADD_TOTAL_TRIFECTA_POINTS,
  SET_LAST_SCRAPED,
} from "./baseballStandingsActionTypes";

const BASEBALL_STANDINGS_STATE_PATH = "baseballStandings";

const initialState = {
  h2hStandingsLoading: false,
  h2hStandingsSuccess: false,
  h2hStandings: [],
  rotoStandingsLoading: false,
  rotoStandingsSuccess: false,
  rotoStandings: [],
  lastScraped: "date",
};

const baseballStandingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SCRAPE_H2H_BASEBALL_STANDINGS_START:
      return {
        ...state,
        h2hStandingsLoading: true,
        h2hStandingsSuccess: false,
      };
    case SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS: {
      return {
        ...state,
        h2hStandingsLoading: false,
        h2hStandingsSuccess: true,
      };
    }
    case SCRAPE_H2H_BASEBALL_STANDINGS_FAILED: {
      return {
        ...state,
        h2hStandingsLoading: false,
        h2hStandingsSuccess: false,
      };
    }
    case ADD_H2H_TRIFECTA_POINTS: {
      return {
        ...state,
        h2hStandings: payload,
      };
    }
    case SCRAPE_ROTO_BASEBALL_STANDINGS_START:
      return {
        ...state,
        rotoStandingsLoading: true,
        rotoStandingsSuccess: false,
      };
    case SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS: {
      return {
        ...state,
        rotoStandingsLoading: false,
        rotoStandingsSuccess: true,
      };
    }
    case SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED: {
      return {
        ...state,
        rotoStandingsLoading: false,
        rotoStandingsSuccess: false,
      };
    }
    case ADD_ROTO_TRIFECTA_POINTS: {
      return {
        ...state,
        rotoStandings: payload,
      };
    }
    case ADD_TOTAL_TRIFECTA_POINTS: {
      return {
        ...state,
        trifectaStandings: payload,
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
    getH2HStandings: () => state.h2hStandings,
    getRotoStandings: () => state.rotoStandings,
    getTrifectaStandings: () => state.trifectaStandings,
    getLastScraped: () => state.lastScraped,
  };
};

export { BASEBALL_STANDINGS_STATE_PATH, getBaseballStandingsStateSelectors };

export default baseballStandingsReducer;
