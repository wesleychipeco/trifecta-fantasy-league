import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
import { createAction } from "redux-starter-kit";
import {
  SCRAPE_BASKETBALL_STANDINGS_START,
  SCRAPE_BASKETBALL_STANDINGS_SUCCESS,
  SCRAPE_BASKETBALL_STANDINGS_FAILED,
  SAVE_BASKETBALL_STANDINGS,
  SORT_TABLE,
  SET_LAST_SCRAPED,
} from "./basketballStandingsActionTypes";
import { basketballStandingsScraper } from "../../scrapers/basketballStandings";
import { format } from "date-fns";
import { findAndSaveToRedux } from "../../databaseManagement";

const actions = {
  scrapeBasketballStandingsStart: createAction(
    SCRAPE_BASKETBALL_STANDINGS_START
  ),
  scrapeBasketballStandingsSuccess: createAction(
    SCRAPE_BASKETBALL_STANDINGS_SUCCESS
  ),
  scrapeBasketballStandingsFailed: createAction(
    SCRAPE_BASKETBALL_STANDINGS_FAILED
  ),
  saveBasketballStandings: createAction(SAVE_BASKETBALL_STANDINGS),
  sortTable: createAction(SORT_TABLE),
  setLastScrped: createAction(SET_LAST_SCRAPED),
};

const scrapeBasketballStandings = year => {
  return async function(dispatch) {
    const standings = await basketballStandingsScraper();
    dispatch(actions.setLastScrped(format(new Date(), "M/D/YY h:mm:ss")));
    console.log("standings", standings);
  };
};

const displayBasketballStandings = year => {
  return async function(dispatch) {
    // connect to mongo
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("trifecta");
    const basketballStandings = db.collection("basketballStandings" + year);

    findAndSaveToRedux(
      dispatch,
      actions.saveBasketballStandings,
      basketballStandings,
      "totalTrifectaPoints"
    );
  };
};

const sortTable = standings => {
  return async function(dispatch) {
    dispatch(actions.sortTable(standings));
  };
};

export { scrapeBasketballStandings, displayBasketballStandings, sortTable };
