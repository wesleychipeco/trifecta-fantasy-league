import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_H2H_BASEBALL_STANDINGS_START,
  SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_H2H_BASEBALL_STANDINGS_FAILED,
  SAVE_H2H_STANDINGS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_START,
  SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED,
  SAVE_ROTO_STATS,
  SAVE_ROTO_STANDINGS,
  SAVE_TRIFECTA_STANDINGS,
  SET_LAST_SCRAPED,
  SORT_TABLE,
} from "./baseballStandingsActionTypes";

const BASEBALL_STANDINGS_STATE_PATH = "baseballStandings";

const initialState = {
  h2hStandingsLoading: false,
  h2hStandingsSuccess: false,
  h2hStandings: [],
  rotoStandingsLoading: false,
  rotoStandingsSuccess: false,
  rotoStandings: [],
  lastScraped: undefined,
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
    case SAVE_H2H_STANDINGS: {
      payload.forEach(item => delete item._id);
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
    case SAVE_ROTO_STATS: {
      payload.forEach(item => delete item._id);
      return {
        ...state,
        rotoStats: payload,
      };
    }
    case SAVE_ROTO_STANDINGS: {
      payload.forEach(item => delete item._id);
      return {
        ...state,
        rotoStandings: payload,
      };
    }
    case SAVE_TRIFECTA_STANDINGS: {
      payload.forEach(item => delete item._id);
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
    case SORT_TABLE: {
      const [standings, tableType] = payload;
      return {
        ...state,
        [tableType]: standings,
      };
    }
    default:
      return state;
  }
};

const getBaseballStandingsStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, BASEBALL_STANDINGS_STATE_PATH);

  return {
    getTrifectaStandings: () => state.trifectaStandings,
    getH2HStandings: () => state.h2hStandings,
    getRotoStandings: () => state.rotoStandings,
    getRotoStats: () => state.rotoStats,
    getLastScraped: () => state.lastScraped,
  };
};

export { BASEBALL_STANDINGS_STATE_PATH, getBaseballStandingsStateSelectors };

export default baseballStandingsReducer;
