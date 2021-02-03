import { createAction } from "redux-starter-kit";
import {
  SAVE_EXISTING_TRADE_HISTORY,
  SORT_TRADE_HISTORY_TABLE,
} from "./tradeHistoryActionTypes";
import {
  returnMongoCollection,
  simpleFindFromMongoSaveToRedux,
} from "../../databaseManagement";

const actions = {
  saveExistingTradeHistory: createAction(SAVE_EXISTING_TRADE_HISTORY),
  sortTradeHistory: createAction(SORT_TRADE_HISTORY_TABLE),
};

const displayTradeHistory = () => {
  return async function (dispatch) {
    const tradeHistoryCollection = await returnMongoCollection("tradeHistory");
    console.log("TRADE", tradeHistoryCollection);
    simpleFindFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingTradeHistory,
      tradeHistoryCollection,
      "date"
    );
  };
};

const sortTable = (history) => {
  return async function (dispatch) {
    dispatch(actions.sortTradeHistory(history));
  };
};

export { displayTradeHistory, sortTable };
