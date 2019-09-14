import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_FOOTBALL_STANDINGS_START,
  SCRAPE_FOOTBALL_STANDINGS_SUCCESS,
  SCRAPE_FOOTBALL_STANDINGS_FAILED,
  SAVE_FOOTBALL_STANDINGS,
  SORT_TABLE,
  SET_LAST_SCRAPED,
} from "./footballStandingsActionTypes";

const FOOTBALL_STANDINGS_STATE_PATH = "footballStandings";

const initialState = {
  footballStandingsLoading: false,
  footballStandingsSuccess: false,
  footballStandings: [],
  lastScraped: null,
};

const footballStandingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SCRAPE_FOOTBALL_STANDINGS_START: {
      return {
        ...state,
        footballStandingsLoading: true,
        footballStandingsSuccess: false,
      };
    }
    case SCRAPE_FOOTBALL_STANDINGS_SUCCESS: {
      return {
        ...state,
        footballStandingsLoading: false,
        footballStandingsSuccess: true,
      };
    }
    case SCRAPE_FOOTBALL_STANDINGS_FAILED: {
      return {
        ...state,
        footballStandingsLoading: false,
        footballStandingsSuccess: false,
      };
    }
    case SAVE_FOOTBALL_STANDINGS: {
      return {
        ...state,
        footballStandings: payload,
      };
    }
    case SET_LAST_SCRAPED: {
      return {
        ...state,
        lastScraped: payload,
      };
    }
    case SORT_TABLE: {
      return {
        ...state,
        footballStandings: payload,
      };
    }
    default: {
      return state;
    }
  }
};

const getFootballStandingsStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, FOOTBALL_STANDINGS_STATE_PATH);

  return {
    getFootballStandings: () => state.footballStandings,
    getLastScraped: () => state.lastScraped,
  };
};

export { FOOTBALL_STANDINGS_STATE_PATH, getFootballStandingsStateSelectors };

export default footballStandingsReducer;
