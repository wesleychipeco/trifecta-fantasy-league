import { createAction } from "redux-starter-kit";
import {
  SCRAPE_FOOTBALL_STANDINGS_START,
  SCRAPE_FOOTBALL_STANDINGS_SUCCESS,
  SCRAPE_FOOTBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_FOOTBALL_STANDINGS,
  SAVE_EXISTING_FOOTBALL_STANDINGS,
  SORT_FOOTBALL_STANDINGS_TABLE,
  SET_FOOTBALL_STANDINGS_LAST_SCRAPED,
} from "./footballStandingsActionTypes";
import { footballStandingsScraper } from "../../scrapers/footballStandings";
import { format } from "date-fns";
import { assignFootballTrifectaPoints } from "../../computators/assignFootballTrifectaPoints";
import {
  deleteAndInsert,
  returnMongoCollection,
  findAndSaveToRedux,
} from "../../databaseManagement";
import {
  retriveOwnerIdsOwnerNamesArray,
  addOwnerNames,
} from "../../computators/addOwnerNames";

const actions = {
  scrapeFootballStandingsStart: createAction(SCRAPE_FOOTBALL_STANDINGS_START),
  scrapeFootballStandingsSuccess: createAction(
    SCRAPE_FOOTBALL_STANDINGS_SUCCESS
  ),
  scrapeFootballStandingsFailed: createAction(SCRAPE_FOOTBALL_STANDINGS_FAILED),
  saveScrapedFootballStandings: createAction(SAVE_SCRAPED_FOOTBALL_STANDINGS),
  saveExistingFootballStandings: createAction(SAVE_EXISTING_FOOTBALL_STANDINGS),
  sortFootballStandingsTable: createAction(SORT_FOOTBALL_STANDINGS_TABLE),
  setFootballStandingsLastScraped: createAction(
    SET_FOOTBALL_STANDINGS_LAST_SCRAPED
  ),
};

const scrapeFootballStandings = year => {
  return async function(dispatch) {
    const footballStandingsScraped = await footballStandingsScraper(year);
    const ownerIdsOwnerNamesArray = await retriveOwnerIdsOwnerNamesArray();
    dispatch(actions.scrapeFootballStandingsStart);

    if (footballStandingsScraped) {
      dispatch(
        actions.setFootballStandingsLastScraped(
          format(new Date(), "M/D/YY h:mm:ss")
        )
      );
      dispatch(actions.scrapeFootballStandingsSuccess);

      const footballStandingsWithoutNames = await assignFootballTrifectaPoints(
        footballStandingsScraped,
        "winPer",
        "highToLow",
        "trifectaPoints",
        20,
        2
      );

      const footballStandings = await addOwnerNames(
        ownerIdsOwnerNamesArray,
        footballStandingsWithoutNames
      );

      const footballStandingsCollection = returnMongoCollection(
        "footballStandings" + year
      );

      deleteAndInsert(
        dispatch,
        actions.saveScrapedFootballStandings,
        footballStandingsCollection,
        footballStandings
      );
    } else {
      dispatch(actions.scrapeFootballStandingsFailed);
    }
  };
};

const displayFootballStandings = (year, sortColumn = "totalTrifectaPoints") => {
  return async function(dispatch) {
    const footballStandingsCollection = returnMongoCollection(
      "footballStandings" + year
    );

    findAndSaveToRedux(
      dispatch,
      actions.saveExistingFootballStandings,
      footballStandingsCollection,
      sortColumn
    );
  };
};

const sortTable = standings => {
  return async function(dispatch) {
    dispatch(actions.sortFootballStandingsTable(standings));
  };
};

export { scrapeFootballStandings, displayFootballStandings, sortTable };
