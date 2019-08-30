import { createAction } from "redux-starter-kit";
import {
  SCRAPE_H2H_BASEBALL_STANDINGS_START,
  SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_H2H_BASEBALL_STANDINGS_FAILED,
  SCRAPE_ROTO_BASEBALL_STANDINGS_START,
  SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED,
  SET_LAST_SCRAPED,
  ADD_H2H_TRIFECTA_POINTS,
  ADD_ROTO_TRIFECTA_POINTS,
} from "./baseballStandingsActionTypes";
import {
  h2hStandingsScraper,
  rotoStatsScraper,
} from "../../scrapers/baseballStandings";
import { assignRankPoints } from "../../computators/assignRankPoints";
import { sumRotoPoints } from "../../computators/sumRotoPoints";
import { format } from "date-fns";

const actions = {
  scrapeH2HBaseballStandingsStart: createAction(
    SCRAPE_H2H_BASEBALL_STANDINGS_START
  ),
  scrapeH2HBaseballStandingsSuccess: createAction(
    SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS
  ),
  scrapeH2HBaseballStandingsFailed: createAction(
    SCRAPE_H2H_BASEBALL_STANDINGS_FAILED
  ),
  addH2HTrifectaPoints: createAction(ADD_H2H_TRIFECTA_POINTS),
  scrapeRotoBaseballStandingsStart: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_START
  ),
  scrapeRotoBaseballStandingsSuccess: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS
  ),
  scrapeRotoBaseballStandingsFailed: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED
  ),
  addRotoTrifectaPoints: createAction(ADD_ROTO_TRIFECTA_POINTS),
  setLastScraped: createAction(SET_LAST_SCRAPED),
};

const scrapeRotoBaseballStandings = () => {
  return async function(dispatch) {
    let rotoStandings = await rotoStatsScraper();

    dispatch(actions.scrapeRotoBaseballStandingsStart);

    if (rotoStandings) {
      dispatch(actions.scrapeRotoBaseballStandingsSuccess);
      const rotoCategoriesArray = [
        { category: "R", sortDirection: "highToLow" },
        { category: "HR", sortDirection: "highToLow" },
        { category: "RBI", sortDirection: "highToLow" },
        { category: "K", sortDirection: "lowToHigh" },
        { category: "SB", sortDirection: "highToLow" },
        { category: "OBP", sortDirection: "highToLow" },
        { category: "SO", sortDirection: "highToLow" },
        { category: "QS", sortDirection: "highToLow" },
        { category: "W", sortDirection: "highToLow" },
        { category: "SV", sortDirection: "highToLow" },
        { category: "ERA", sortDirection: "lowToHigh" },
        { category: "WHIP", sortDirection: "lowToHigh" },
      ];

      for (const rotoCategory of rotoCategoriesArray) {
        rotoStandings = await assignRankPoints(
          rotoStandings,
          rotoCategory.category,
          rotoCategory.sortDirection,
          rotoCategory.category + "Points",
          10,
          1
        );
      }

      const rotoStandingsWithRotoPoints = await sumRotoPoints(
        rotoStandings,
        "totalPoints"
      );

      const rotoStandingsWithTrifectaPoints = await assignRankPoints(
        rotoStandingsWithRotoPoints,
        "totalPoints",
        "highToLow",
        "rotoTrifectaPoints",
        10,
        1
      );

      dispatch(actions.addRotoTrifectaPoints(rotoStandingsWithTrifectaPoints));
    } else {
      dispatch(actions.scrapeRotoBaseballStandingsFailed);
    }
  };
};

const scrapeH2HBaseballStandings = () => {
  return async function(dispatch) {
    const h2hStandings = await h2hStandingsScraper();

    dispatch(actions.scrapeH2HBaseballStandingsStart);

    if (h2hStandings) {
      dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:mm:ss")));
      dispatch(actions.scrapeH2HBaseballStandingsSuccess);

      const baseballStandingsWithH2HTrifectaPoints = await assignRankPoints(
        h2hStandings,
        "winPer",
        "highToLow",
        "h2hTrifectaPoints",
        10,
        1
      );
      console.log("h2h", baseballStandingsWithH2HTrifectaPoints);
      dispatch(
        actions.addH2HTrifectaPoints(baseballStandingsWithH2HTrifectaPoints)
      );
    } else {
      dispatch(actions.scrapeH2HBaseballStandingsFailed);
    }
  };
};

export { scrapeH2HBaseballStandings, scrapeRotoBaseballStandings };
