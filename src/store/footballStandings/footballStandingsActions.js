import { createAction } from "redux-starter-kit";
import {
  SCRAPE_FOOTBALL_STANDINGS_START,
  SCRAPE_FOOTBALL_STANDINGS_SUCCESS,
  SCRAPE_FOOTBALL_STANDINGS_FAILED,
  SAVE_FOOTBALL_STANDINGS,
  SORT_TABLE,
  SET_LAST_SCRAPED,
} from "./footballStandingsActionTypes";
import { footballStandingsScraper } from "../../scrapers/footballStandings";
import { format } from "date-fns";
import { assignRankPoints } from "../../computators/assignRankPoints";
import {
  deleteAndInsert,
  returnMongoCollection,
  findAndSaveToRedux,
} from "../../databaseManagement";

const actions = {
  scrapeFootballStandingsStart: createAction(SCRAPE_FOOTBALL_STANDINGS_START),
  scrapeFootballStandingsSuccess: createAction(
    SCRAPE_FOOTBALL_STANDINGS_SUCCESS
  ),
  scrapeFootballStandingsFailed: createAction(SCRAPE_FOOTBALL_STANDINGS_FAILED),
  saveFootballStandings: createAction(SAVE_FOOTBALL_STANDINGS),
  sortTable: createAction(SORT_TABLE),
  setLastScraped: createAction(SET_LAST_SCRAPED),
};

const scrapeFootballStandings = year => {
  return async function(dispatch) {
    const footballStandingsScraped = await footballStandingsScraper();
    dispatch(actions.scrapeFootballStandingsStart);
    console.log(footballStandingsScraped);

    if (footballStandingsScraped) {
      dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:mm:ss")));
      dispatch(actions.scrapeFootballStandingsSuccess);

      const footballStandings = await assignRankPoints(
        footballStandingsScraped,
        "winPer",
        "highToLow",
        "trifectaPoints",
        20,
        2
      );

      const footballStandingsCollection = returnMongoCollection(
        "footballStandings" + year
      );

      deleteAndInsert(
        dispatch,
        actions.saveFootballStandings,
        footballStandingsCollection,
        footballStandings
      );
    } else {
      dispatch(actions.scrapeFootballStandingsFailed);
    }
  };
};

const displayFootballStandings = year => {
  return async function(dispatch) {
    const footballStandingsCollection = returnMongoCollection(
      "footballStandings" + year
    );

    findAndSaveToRedux(
      dispatch,
      actions.saveFootballStandings,
      footballStandingsCollection,
      "trifectaPoints"
    );
  };
};

const sortTable = standings => {
  return async function(dispatch) {
    dispatch(actions.sortTable(standings));
  };
};

export { scrapeFootballStandings, displayFootballStandings, sortTable };
