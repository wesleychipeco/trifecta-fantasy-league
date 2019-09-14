import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_H2H_BASEBALL_STANDINGS_START,
  SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_H2H_BASEBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_H2H_STANDINGS,
  SAVE_EXISTING_H2H_STANDINGS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_START,
  SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_ROTO_STATS,
  SAVE_EXISTING_ROTO_STATS,
  SAVE_SCRAPED_ROTO_STANDINGS,
  SAVE_EXISTING_ROTO_STANDINGS,
  SAVE_SCRAPED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SORT_BASEBALL_STANDINGS_TABLE,
  SET_BASEBALL_STANDINGS_LAST_SCRAPED,
} from "./baseballStandingsActionTypes";
import { filterIdField } from "../../databaseManagement";

const BASEBALL_STANDINGS_STATE_PATH = "baseballStandings";

const initialState = {
  h2hStandingsLoading: false,
  h2hStandingsSuccess: false,
  h2hStandings: [],
  rotoStandingsLoading: false,
  rotoStandingsSuccess: false,
  rotoStandings: [],
  lastScraped: null,
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
    case SAVE_SCRAPED_H2H_STANDINGS: {
      const filteredPayload = filterIdField(payload);
      return {
        ...state,
        h2hStandings: filteredPayload,
      };
    }
    case SAVE_EXISTING_H2H_STANDINGS: {
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
    case SAVE_SCRAPED_ROTO_STATS: {
      const filteredPayload = filterIdField(payload);
      return {
        ...state,
        rotoStats: filteredPayload,
      };
    }
    case SAVE_EXISTING_ROTO_STATS: {
      return {
        ...state,
        rotoStats: payload,
      };
    }
    case SAVE_SCRAPED_ROTO_STANDINGS: {
      const filteredPayload = filterIdField(payload);
      return {
        ...state,
        rotoStandings: filteredPayload,
      };
    }
    case SAVE_EXISTING_ROTO_STANDINGS: {
      return {
        ...state,
        rotoStandings: payload,
      };
    }
    case SAVE_SCRAPED_TRIFECTA_STANDINGS: {
      const filteredPayload = filterIdField(payload);
      return {
        ...state,
        trifectaStandings: filteredPayload,
      };
    }
    case SAVE_EXISTING_TRIFECTA_STANDINGS: {
      return {
        ...state,
        trifectaStandings: payload,
      };
    }
    case SET_BASEBALL_STANDINGS_LAST_SCRAPED: {
      return {
        ...state,
        lastScraped: payload,
      };
    }
    case SORT_BASEBALL_STANDINGS_TABLE: {
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
