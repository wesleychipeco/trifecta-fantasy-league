import { createAction } from "redux-starter-kit";
import {
  SCRAPE_BASEBALL_STANDINGS,
  SET_LAST_SCRAPED,
} from "./baseballStandingsActionTypes";

const scrapeBaseballStandings = createAction(SCRAPE_BASEBALL_STANDINGS);
const setLastScraped = createAction(SET_LAST_SCRAPED);

export { scrapeBaseballStandings, setLastScraped };
