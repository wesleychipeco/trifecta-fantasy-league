import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_DYNASTY_BASEBALL_STANDINGS_START,
  SCRAPE_DYNASTY_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_DYNASTY_BASEBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_DYNASTY_BASEBALL_STANDINGS,
  SAVE_EXISTING_DYNASTY_BASEBALL_STANDINGS,
  SET_DYNASTY_BASEBALL_STANDINGS_LAST_SCRAPED,
  SORT_DYNASTY_BASEBALL_STANDINGS_TABLE,
} from "./dynastyBaseballStandingsActionTypes";
import { filterIdField } from "../../databaseManagement";

const DYNASTY_BASEBALL_STANDINGS_STATE_PATH = "dynastyBaseballStandings";

const initialState = {
  standingsLoading: false,
  standingsSuccess: false,
  standings: [],
  lastScraped: [],
};

const dynastyBaseballStandingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SCRAPE_DYNASTY_BASEBALL_STANDINGS_START:
      return {
        ...state,
        standingsLoading: true,
        standingsSuccess: false,
      };
    case SCRAPE_DYNASTY_BASEBALL_STANDINGS_SUCCESS:
      return {
        ...state,
        standingsLoading: false,
        standingsSuccess: true,
      };
    case SCRAPE_DYNASTY_BASEBALL_STANDINGS_FAILED:
      return {
        ...state,
        standingsLoading: false,
        standingsSuccess: false,
      };
    case SAVE_SCRAPED_DYNASTY_BASEBALL_STANDINGS:
      const filteredPayload = filterIdField(payload);
      return {
        ...state,
        standings: filteredPayload,
      };
    case SAVE_EXISTING_DYNASTY_BASEBALL_STANDINGS:
      return {
        ...state,
        standings: payload,
      };
    case SET_DYNASTY_BASEBALL_STANDINGS_LAST_SCRAPED:
      return {
        ...state,
        lastScraped: payload,
      };
    case SORT_DYNASTY_BASEBALL_STANDINGS_TABLE:
      const [standings, tableType] = payload;
      return {
        ...state,
        [tableType]: standings,
      };
    default:
      return state;
  }
};

const getDynastyBaseballStandingsStateSelectors = (rootState) => {
  const state = getStateSlice(rootState, DYNASTY_BASEBALL_STANDINGS_STATE_PATH);

  return {
    getStandings: () => state.standings,
    getLastScraped: () => state.lastScraped,
  };
};

export {
  DYNASTY_BASEBALL_STANDINGS_STATE_PATH,
  getDynastyBaseballStandingsStateSelectors,
};

export default dynastyBaseballStandingsReducer;
