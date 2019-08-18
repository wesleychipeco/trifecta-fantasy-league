import { createAction } from "redux-starter-kit";
import {
  SCRAPE_BASEBALL_STANDINGS_START,
  SCRAPE_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_BASEBALL_STANDINGS_FAILED,
  SET_LAST_SCRAPED,
} from "./baseballStandingsActionTypes";
import { baseballStandingsScraper } from "../../scrapers/baseballStandings";
import { format } from "date-fns";

const actions = {
  scrapeBaseballStandingsStart: createAction(SCRAPE_BASEBALL_STANDINGS_START),
  scrapeBaseballStandingsSuccess: createAction(
    SCRAPE_BASEBALL_STANDINGS_SUCCESS
  ),
  scrapeBaseballStandingsFailed: createAction(SCRAPE_BASEBALL_STANDINGS_FAILED),
  setLastScraped: createAction(SET_LAST_SCRAPED),
};

const scrapeBaseballStandings = () => {
  return async function(dispatch) {
    const baseballStandings = await baseballStandingsScraper();
    console.log("BASEBALL STANDINGS", baseballStandings);

    dispatch(actions.scrapeBaseballStandingsStart);

    if (baseballStandings) {
      dispatch(actions.scrapeBaseballStandingsSuccess(baseballStandings));
      dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:m:s")));
    } else {
      dispatch(actions.scrapeBaseballStandingsFailed);
    }
  };
};

export { scrapeBaseballStandings };
