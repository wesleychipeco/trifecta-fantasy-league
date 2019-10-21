import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_BASKETBALL_STANDINGS_START,
  SCRAPE_BASKETBALL_STANDINGS_SUCCESS,
  SCRAPE_BASKETBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_H2H_STANDINGS,
  SAVE_SCRAPED_ROTO_STATS,
  SAVE_SCRAPED_ROTO_STANDINGS,
  SAVE_SCRAPED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_H2H_STANDINGS,
  SAVE_EXISTING_ROTO_STATS,
  SAVE_EXISTING_ROTO_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SAVE_EXISTING_BASKETBALL_STANDINGS,
  SORT_BASKETBALL_STANDINGS_TABLE,
  SET_BASKETBALL_STANDINGS_LAST_SCRAPED,
} from "./basketballStandingsActionTypes";
import { filterIdField } from "../../databaseManagement";

const BASKETBALL_STANDINGS_STATE_PATH = "basketballStandings";

const initialState = {
  basketballStandingsLoading: false,
  basketballStandingsSuccess: false,
  h2hStandings: [],
  rotoStandings: [],
  rotoStats: [],
  trifectaStandings: [],
  basketballStandings: [],
  lastScraped: null,
};

const basketballStandingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  let filteredPayload;
  switch (type) {
    case SCRAPE_BASKETBALL_STANDINGS_START: {
      return {
        ...state,
        basketballStandingsLoading: true,
        basketballStandingsSuccess: false,
      };
    }
    case SCRAPE_BASKETBALL_STANDINGS_SUCCESS: {
      return {
        ...state,
        basketballStandingsLoading: false,
        basketballStandingsSuccess: true,
      };
    }
    case SCRAPE_BASKETBALL_STANDINGS_FAILED: {
      return {
        ...state,
        basketballStandingsLoading: false,
        basketballStandingsSuccess: false,
      };
    }
    case SAVE_SCRAPED_H2H_STANDINGS:
      filteredPayload = filterIdField(payload);
      return {
        ...state,
        h2hStandings: filteredPayload,
      };
    case SAVE_SCRAPED_ROTO_STANDINGS:
      filteredPayload = filterIdField(payload);
      return {
        ...state,
        rotoStandings: filteredPayload,
      };
    case SAVE_SCRAPED_ROTO_STATS:
      filteredPayload = filterIdField(payload);
      return {
        ...state,
        rotoStats: filteredPayload,
      };
    case SAVE_SCRAPED_TRIFECTA_STANDINGS:
      filteredPayload = filterIdField(payload);
      return {
        ...state,
        trifectaStandings: filteredPayload,
      };
    case SAVE_EXISTING_H2H_STANDINGS:
      return {
        ...state,
        h2hStandings: payload,
      };
    case SAVE_EXISTING_ROTO_STANDINGS:
      return {
        ...state,
        rotoStandings: payload,
      };
    case SAVE_EXISTING_ROTO_STATS:
      return {
        ...state,
        rotoStats: payload,
      };
    case SAVE_EXISTING_TRIFECTA_STANDINGS:
      return {
        ...state,
        trifectaStandings: payload,
      };
    case SAVE_EXISTING_BASKETBALL_STANDINGS:
      return {
        ...state,
        basketballStandings: payload,
      };
    case SET_BASKETBALL_STANDINGS_LAST_SCRAPED: {
      return {
        ...state,
        lastScraped: payload,
      };
    }
    case SORT_BASKETBALL_STANDINGS_TABLE: {
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

const getBasketballStandingsStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, BASKETBALL_STANDINGS_STATE_PATH);

  return {
    getTrifectaStandings: () => state.trifectaStandings,
    getH2HStandings: () => state.h2hStandings,
    getRotoStandings: () => state.rotoStandings,
    getRotoStats: () => state.rotoStats,
    getBasketballStandings: () => state.basketballStandings,
    getLastScraped: () => state.lastScraped,
  };
};

export {
  BASKETBALL_STANDINGS_STATE_PATH,
  getBasketballStandingsStateSelectors,
};

export default basketballStandingsReducer;
