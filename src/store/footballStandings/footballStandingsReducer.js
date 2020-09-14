import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_FOOTBALL_STANDINGS_START,
  SCRAPE_FOOTBALL_STANDINGS_SUCCESS,
  SCRAPE_FOOTBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_H2H_STANDINGS,
  SAVE_EXISTING_H2H_STANDINGS,
  SAVE_SCRAPED_TOP5_BOTTOM5_STANDINGS,
  SAVE_EXISTING_TOP5_BOTTOM5_STANDINGS,
  SAVE_SCRAPED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SAVE_EXISTING_FOOTBALL_STANDINGS,
  SORT_FOOTBALL_STANDINGS_TABLE,
  SET_FOOTBALL_STANDINGS_LAST_SCRAPED,
} from "./footballStandingsActionTypes";
import { filterIdField } from "../../databaseManagement";

const FOOTBALL_STANDINGS_STATE_PATH = "footballStandings";

const initialState = {
  footballStandingsLoading: false,
  footballStandingsSuccess: false,
  h2hStandings: [],
  top5Bottom5Standings: [],
  trifectaStandings: [],
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
    case SAVE_SCRAPED_TOP5_BOTTOM5_STANDINGS: {
      const filteredPayload = filterIdField(payload);
      return {
        ...state,
        top5Bottom5Standings: filteredPayload,
      };
    }
    case SAVE_EXISTING_TOP5_BOTTOM5_STANDINGS: {
      return {
        ...state,
        top5Bottom5Standings: payload,
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
    case SAVE_EXISTING_FOOTBALL_STANDINGS: {
      return {
        ...state,
        footballStandings: payload,
      };
    }
    case SET_FOOTBALL_STANDINGS_LAST_SCRAPED: {
      return {
        ...state,
        lastScraped: payload,
      };
    }
    case SORT_FOOTBALL_STANDINGS_TABLE: {
      const [standings, tableType] = payload;
      return {
        ...state,
        [tableType]: standings,
      };
    }
    default: {
      return state;
    }
  }
};

const getFootballStandingsStateSelectors = function (rootState) {
  const state = getStateSlice(rootState, FOOTBALL_STANDINGS_STATE_PATH);

  return {
    getTrifectaStandings: () => state.trifectaStandings,
    getH2HStandings: () => state.h2hStandings,
    getTop5Bottom5Standings: () => state.top5Bottom5Standings,
    getFootballStandings: () => state.footballStandings,
    getLastScraped: () => state.lastScraped,
  };
};

export { FOOTBALL_STANDINGS_STATE_PATH, getFootballStandingsStateSelectors };

export default footballStandingsReducer;
