import { createAction } from "redux-starter-kit";
import {
  SCRAPE_H2H_BASEBALL_STANDINGS_START,
  SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_H2H_BASEBALL_STANDINGS_FAILED,
  ADD_H2H_TRIFECTA_POINTS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_START,
  SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED,
  ADD_ROTO_TRIFECTA_POINTS,
  ADD_TOTAL_TRIFECTA_POINTS,
  SET_LAST_SCRAPED,
} from "./baseballStandingsActionTypes";
import {
  h2hStandingsScraper,
  rotoStatsScraper,
} from "../../scrapers/baseballStandings";
import { assignRankPoints } from "../../computators/assignRankPoints";
import { sumRotoPoints } from "../../computators/sumRotoPoints";
import { format } from "date-fns";
import { sumTrifectaPoints } from "../../computators/sumTrifectaPoints";

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
  addTotalTrifectaPoints: createAction(ADD_TOTAL_TRIFECTA_POINTS),
  setLastScraped: createAction(SET_LAST_SCRAPED),
};

const scrapeBaseballStandings = () => {
  return async function(dispatch) {
    const h2hStandings = await h2hStandingsScraper();
    let rotoStandings = await rotoStatsScraper();

    dispatch(actions.scrapeH2HBaseballStandingsStart);
    dispatch(actions.scrapeRotoBaseballStandingsStart);
    console.log("ok");

    console.log("h2h", h2hStandings);
    console.log("roto", rotoStandings);
    if (h2hStandings && rotoStandings) {
      console.log("hi");
      dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:mm:ss")));
      dispatch(actions.scrapeH2HBaseballStandingsSuccess);
      dispatch(actions.scrapeRotoBaseballStandingsSuccess);

      const baseballStandingsWithH2HTrifectaPoints = await assignRankPoints(
        h2hStandings,
        "winPer",
        "highToLow",
        "h2hTrifectaPoints",
        10,
        1
      );
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

      dispatch(
        actions.addH2HTrifectaPoints(baseballStandingsWithH2HTrifectaPoints)
      );
      dispatch(actions.addRotoTrifectaPoints(rotoStandingsWithTrifectaPoints));
      dispatch(
        actions.addTotalTrifectaPoints(
          calculateTrifectaBaseballStandings(
            baseballStandingsWithH2HTrifectaPoints,
            rotoStandingsWithTrifectaPoints
          )
        )
      );
    } else {
      dispatch(actions.scrapeH2HBaseballStandingsFailed);
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

      dispatch(
        actions.addH2HTrifectaPoints(baseballStandingsWithH2HTrifectaPoints)
      );
    } else {
      dispatch(actions.scrapeH2HBaseballStandingsFailed);
    }
  };
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

////////// Try having one baseball standings scraper function that gets called from the component, linking them all to one
////////// function then synchronously dispatching the actions at the end with their own copies of the state to the different leafs
const calculateTrifectaBaseballStandings = (h2hStandings, rotoStandings) => {
  console.log(h2hStandings, ":::::", rotoStandings);
  if (h2hStandings.length > 0 && rotoStandings.length > 0) {
    const combinedStandingsArray = [];

    h2hStandings.forEach(h2hTeam => {
      const combinedStandings = {};
      const h2hTeamName = h2hTeam.teamName;

      const team = h2hStandings.find(
        teamname => teamname.teamName === h2hTeamName
      );

      const team2 = rotoStandings.find(
        teamname => teamname.teamName === h2hTeamName
      );

      combinedStandings.teamName = h2hTeamName;
      combinedStandings.h2hTrifectaPoints = team.h2hTrifectaPoints;
      combinedStandings.rotoTrifectaPoints = team2.rotoTrifectaPoints;
      combinedStandings.totalTrifectaPoints =
        team.h2hTrifectaPoints + team2.rotoTrifectaPoints;
      console.log("combinedStandings individual", combinedStandings);
      combinedStandingsArray.push(combinedStandings);
    });

    console.log("here combined standings array", combinedStandingsArray);
    return combinedStandingsArray;
    //   for (let i = 0; i < h2hStandings.length; i++) {

    //     console.log("a", i);
    //     combinedStandings.teamName = h2hStandings[i].teamName;
    //     combinedStandings.h2hTrifectaPoints = h2hStandings[i].h2hTrifectaPoints;
    //     console.log("i", i);
    //     console.log("h2h", h2hStandings[i]);
    //     console.log("roto", rotoStandings[i]);

    //     combinedStandings.rotoTrifectaPoints =
    //       rotoStandings[i].rotoTrifectaPoints;
    //     console.log("b", i);

    //     // h2hStandings[i].forEach(h2hTeam => {
    //     //   (h2hTrifectaStandings.teamName = h2hTeam.teamName),
    //     //     (h2hTrifectaStandings.h2hTrifectaPoints =
    //     //       h2hTeam.h2hTrifectaPoints);
    //     // });

    //     // rotoStandings[i].forEach(rotoTeam => {
    //     //   rotoTrifectaStandings.rotoTrifectaPoints =
    //     //     rotoTeam.rotoTrifectaPoints;
    //     // });

    //     combinedStandingsArray.push(combinedStandings);
    //     console.log("combinedStandings individual", combinedStandings);
    //   }
    //   console.log("combinedStandings array", combinedStandingsArray);
    //   // const trifectaStandings = await sumTrifectaPoints(combinedStandings);
    //   // console.log("trifecta standings", trifectaStandings);
  }
};

export {
  scrapeBaseballStandings,
  scrapeH2HBaseballStandings,
  scrapeRotoBaseballStandings,
  calculateTrifectaBaseballStandings,
};
