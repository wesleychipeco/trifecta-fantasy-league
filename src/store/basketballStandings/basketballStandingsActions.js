import { createAction } from "redux-starter-kit";
import {
  SCRAPE_BASKETBALL_STANDINGS_START,
  SCRAPE_BASKETBALL_STANDINGS_SUCCESS,
  SCRAPE_BASKETBALL_STANDINGS_FAILED,
} from "./basketballStandingsActionTypes";
import { basketballStandingsScraper } from "../../scrapers/basketballStandings";

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
};

const scrapeBasketballStandings = () => {
  return async function(dispatch) {
    const standings = await basketballStandingsScraper();

    console.log("standings", standings);
  };
};

const displayBasketballStandings = () => {
  return async function(dispatch) {
    console.log("display basketball standings from mongodb");
  };
};

export { scrapeBasketballStandings, displayBasketballStandings };
