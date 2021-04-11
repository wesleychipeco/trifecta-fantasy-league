import { createAction } from "redux-starter-kit";
import {
  SCRAPE_DYNASTY_BASEBALL_STANDINGS_START,
  SCRAPE_DYNASTY_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_DYNASTY_BASEBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_DYNASTY_BASEBALL_STANDINGS,
  SAVE_EXISTING_DYNASTY_BASEBALL_STANDINGS,
  SET_DYNASTY_BASEBALL_STANDINGS_LAST_SCRAPED,
  SORT_DYNASTY_BASEBALL_STANDINGS_TABLE,
} from "./dynastyBaseballStandingsActionTypes";
import { dynastyBaseballStandingsScraper } from "../../scrapers/dynastyBaseballStandings";
import { format } from "date-fns";
import { assignRankPoints } from "../../computators/assignRankPoints";
import { sortArrayBy } from "../../utils";
import {
  returnMongoCollection,
  findFromMongoSaveToRedux,
  deleteInsertDispatch,
} from "../../databaseManagement";
import {
  retriveOwnerIdsOwnerNamesArray,
  addOwnerNames,
} from "../../computators/addOwnerNames";

const actions = {
  scrapeDynastyBaseballStandingsStart: createAction(
    SCRAPE_DYNASTY_BASEBALL_STANDINGS_START
  ),
  scrapeDynastyBaseballStandingsSuccess: createAction(
    SCRAPE_DYNASTY_BASEBALL_STANDINGS_SUCCESS
  ),
  scrapeDynastyBaseballStandingsFailed: createAction(
    SCRAPE_DYNASTY_BASEBALL_STANDINGS_FAILED
  ),
  saveScrapedDynastyBaseballStandings: createAction(
    SAVE_SCRAPED_DYNASTY_BASEBALL_STANDINGS
  ),
  saveExistingDynastyBaseballStandings: createAction(
    SAVE_EXISTING_DYNASTY_BASEBALL_STANDINGS
  ),
  setDynastyBaseballStandingsLastScraped: createAction(
    SET_DYNASTY_BASEBALL_STANDINGS_LAST_SCRAPED
  ),
  sortDynastyBaseballStandingsTable: createAction(
    SORT_DYNASTY_BASEBALL_STANDINGS_TABLE
  ),
};

const scrapeDynastyBaseballStandings = (year) => {
  return async function (dispatch) {
    const standingsScrape = await dynastyBaseballStandingsScraper(year);
    dispatch(actions.scrapeDynastyBaseballStandingsStart);

    // const ownerIdsOwnerNamesArray = await retriveOwnerIdsOwnerNamesArray();

    if (standingsScrape) {
      dispatch(actions.scrapeDynastyBaseballStandingsSuccess);
      dispatch(
        actions.setDynastyBaseballStandingsLastScraped(
          format(new Date(), "M/D/YY h:mm:ss")
        )
      );
      const standingsWithoutNames = await assignRankPoints(
        standingsScrape,
        "winPer",
        "highToLow",
        "dynastyPoints",
        2,
        1
      );
      console.log("###", standingsWithoutNames);
    } else {
      dispatch(actions.scrapeDynastyBaseballStandingsFailed);
    }
  };
};

export { scrapeDynastyBaseballStandings };
