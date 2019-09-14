import { createAction } from "redux-starter-kit";
import {
  SCRAPE_BASKETBALL_STANDINGS_START,
  SCRAPE_BASKETBALL_STANDINGS_SUCCESS,
  SCRAPE_BASKETBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_BASKETBALL_STANDINGS,
  SAVE_EXISTING_BASKETBALL_STANDINGS,
  SORT_BASKETBALL_STANDINGS_TABLE,
  SET_BASKETBALL_STANDINGS_LAST_SCRAPED,
} from "./basketballStandingsActionTypes";
import { basketballStandingsScraper } from "../../scrapers/basketballStandings";
import { format } from "date-fns";
import {
  returnMongoCollection,
  findAndSaveToRedux,
} from "../../databaseManagement";

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
  saveScrapedBasketballStandings: createAction(
    SAVE_SCRAPED_BASKETBALL_STANDINGS
  ),
  saveExistingBasketballStandings: createAction(
    SAVE_EXISTING_BASKETBALL_STANDINGS
  ),
  sortBasketballStandingsTable: createAction(SORT_BASKETBALL_STANDINGS_TABLE),
  setBasketballStandingsLastScraped: createAction(
    SET_BASKETBALL_STANDINGS_LAST_SCRAPED
  ),
};

const scrapeBasketballStandings = year => {
  return async function(dispatch) {
    const standings = await basketballStandingsScraper();
    dispatch(
      actions.setBasketballStandingsLastScraped(
        format(new Date(), "M/D/YY h:mm:ss")
      )
    );
    console.log("standings", standings);
  };
};

const displayBasketballStandings = year => {
  return async function(dispatch) {
    // connect to mongo
    const basketballStandings = returnMongoCollection(
      "basketballStandings" + year
    );

    findAndSaveToRedux(
      dispatch,
      actions.saveExistingBasketballStandings,
      basketballStandings,
      "totalTrifectaPoints"
    );
  };
};

const sortTable = standings => {
  return async function(dispatch) {
    dispatch(actions.sortBasketballStandingsTable(standings));
  };
};

export { scrapeBasketballStandings, displayBasketballStandings, sortTable };
