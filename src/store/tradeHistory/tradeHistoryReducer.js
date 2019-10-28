import { getStateSlice } from "../reduxUtils";
import {
  SAVE_EXISTING_TRADE_HISTORY,
  SORT_TRADE_HISTORY_TABLE,
} from "./tradeHistoryActionTypes";

const TRADE_HISTORY_STATE_PATH = "tradeHistory";

const initialState = {
  tradeHistory: [],
};

const tradeHistoryReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SAVE_EXISTING_TRADE_HISTORY:
      return {
        ...state,
        tradeHistory: payload,
      };
    case SORT_TRADE_HISTORY_TABLE:
      return {
        ...state,
        tradeHistory: payload,
      };
    default:
      return {
        ...state,
      };
  }
};

const getTradeHistoryStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, TRADE_HISTORY_STATE_PATH);

  return {
    getTradeHistory: () => state.tradeHistory,
  };
};

export { TRADE_HISTORY_STATE_PATH, getTradeHistoryStateSelectors };

export default tradeHistoryReducer;
