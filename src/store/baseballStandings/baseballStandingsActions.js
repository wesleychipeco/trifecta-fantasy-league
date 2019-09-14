import { createAction } from "redux-starter-kit";
import {
  SCRAPE_H2H_BASEBALL_STANDINGS_START,
  SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_H2H_BASEBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_H2H_STANDINGS,
  SAVE_EXISTING_H2H_STANDINGS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_START,
  SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_ROTO_STATS,
  SAVE_EXISTING_ROTO_STATS,
  SAVE_SCRAPED_ROTO_STANDINGS,
  SAVE_EXISTING_ROTO_STANDINGS,
  SAVE_SCRAPED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SET_BASEBALL_STANDINGS_LAST_SCRAPED,
  SORT_BASEBALL_STANDINGS_TABLE,
} from "./baseballStandingsActionTypes";
import {
  h2hStandingsScraper,
  rotoStatsScraper,
} from "../../scrapers/baseballStandings";
import { assignRankPoints } from "../../computators/assignRankPoints";
import { sumRotoPoints } from "../../computators/sumRotoPoints";
import { format } from "date-fns";
import { sortArrayBy } from "../../utils";
import {
  returnMongoCollection,
  deleteAndInsert,
  findAndSaveToRedux,
} from "../../databaseManagement";

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
  saveScrapedH2HStandings: createAction(SAVE_SCRAPED_H2H_STANDINGS),
  saveExistingH2HStandings: createAction(SAVE_EXISTING_H2H_STANDINGS),
  scrapeRotoBaseballStandingsStart: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_START
  ),
  scrapeRotoBaseballStandingsSuccess: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS
  ),
  scrapeRotoBaseballStandingsFailed: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED
  ),
  saveScrapedRotoStats: createAction(SAVE_SCRAPED_ROTO_STATS),
  saveExistingRotoStats: createAction(SAVE_EXISTING_ROTO_STATS),
  saveScrapedRotoStandings: createAction(SAVE_SCRAPED_ROTO_STANDINGS),
  saveExistingRotoStandings: createAction(SAVE_EXISTING_ROTO_STANDINGS),
  saveScrapedTrifectaStandings: createAction(SAVE_SCRAPED_TRIFECTA_STANDINGS),
  saveExistingTrifectaStandings: createAction(SAVE_EXISTING_TRIFECTA_STANDINGS),
  setBaseballStandingsLastScraped: createAction(
    SET_BASEBALL_STANDINGS_LAST_SCRAPED
  ),
  sortBaseballStandingsTable: createAction(SORT_BASEBALL_STANDINGS_TABLE),
};

const assignRotoCategoryPoints = rotoStandings => {
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
    rotoStandings = assignRankPoints(
      rotoStandings,
      rotoCategory.category,
      rotoCategory.sortDirection,
      rotoCategory.category + "Points",
      10,
      1
    );
  }

  return sumRotoPoints(rotoStandings, "totalPoints");
};

const scrapeBaseballStandings = year => {
  return async function(dispatch) {
    const h2hStandingsScrape = await h2hStandingsScraper();
    dispatch(actions.scrapeH2HBaseballStandingsStart);

    const rotoStandingsScrape = await rotoStatsScraper();
    dispatch(actions.scrapeRotoBaseballStandingsStart);

    if (h2hStandingsScrape) {
      dispatch(actions.scrapeH2HBaseballStandingsSuccess);
      if (rotoStandingsScrape) {
        dispatch(
          actions.setBaseballStandingsLastScraped(
            format(new Date(), "M/D/YY h:mm:ss")
          )
        );
        dispatch(actions.scrapeRotoBaseballStandingsSuccess);
        const rotoStats = [...rotoStandingsScrape];

        // H2H Standings
        const h2hStandings = await assignRankPoints(
          h2hStandingsScrape,
          "winPer",
          "highToLow",
          "h2hTrifectaPoints",
          10,
          1
        );

        // Roto Standings
        const rotoStandingsWithRotoPoints = assignRotoCategoryPoints(
          rotoStandingsScrape
        );
        const rotoStandings = await assignRankPoints(
          rotoStandingsWithRotoPoints,
          "totalPoints",
          "highToLow",
          "rotoTrifectaPoints",
          10,
          1
        );

        // connect to mongo
        const baseballTrifectaStandingsCollection = returnMongoCollection(
          "baseballTrifectaStandings" + year
        );
        const baseballH2HStandingsCollection = returnMongoCollection(
          "baseballH2HStandings" + year
        );
        const baseballRotoStandingsCollection = returnMongoCollection(
          "baseballRotoStandings" + year
        );
        const baseballRotoStatsCollection = returnMongoCollection(
          "baseballRotoStats" + year
        );

        // Save H2H Standings, Roto Standings, Roto Stats, and Trifecta Standings
        deleteAndInsert(
          dispatch,
          actions.saveScrapedH2HStandings,
          baseballH2HStandingsCollection,
          h2hStandings
        );
        deleteAndInsert(
          dispatch,
          actions.saveScrapedRotoStandings,
          baseballRotoStandingsCollection,
          rotoStandings
        );
        deleteAndInsert(
          dispatch,
          actions.saveScrapedRotoStats,
          baseballRotoStatsCollection,
          rotoStats
        );
        deleteAndInsert(
          dispatch,
          actions.saveScrapedTrifectaStandings,
          baseballTrifectaStandingsCollection,
          calculateTrifectaBaseballStandings(h2hStandings, rotoStandings)
        );
      } else {
        dispatch(actions.scrapeRotoBaseballStandingsFailed);
      }
    } else {
      dispatch(actions.scrapeH2HBaseballStandingsFailed);
    }
  };
};

const calculateTrifectaBaseballStandings = (h2hStandings, rotoStandings) => {
  if (h2hStandings.length > 0 && rotoStandings.length > 0) {
    const combinedStandingsArray = [];

    // Loop through H2H Standings, each team
    h2hStandings.forEach(team => {
      const combinedStandings = {};
      const teamName = team.teamName;

      const teamH2H = h2hStandings.find(
        h2hLoopingTeam => h2hLoopingTeam.teamName === teamName
      );

      const teamRoto = rotoStandings.find(
        rotoLoopingTeam => rotoLoopingTeam.teamName === teamName
      );

      const h2hPoints = teamH2H.h2hTrifectaPoints;
      const rotoPoints = teamRoto.rotoTrifectaPoints;

      combinedStandings.teamName = teamName;
      combinedStandings.h2hTrifectaPoints = h2hPoints;
      combinedStandings.rotoTrifectaPoints = rotoPoints;
      combinedStandings.trifectaPoints = h2hPoints + rotoPoints;

      combinedStandingsArray.push(combinedStandings);
    });

    return sortArrayBy(combinedStandingsArray, "trifectaPoints", true);
  }
};

const displayBaseballStandings = year => {
  return async function(dispatch) {
    // connect to mongo
    const baseballH2HStandings = returnMongoCollection(
      "baseballH2HStandings" + year
    );
    const baseballRotoStandings = returnMongoCollection(
      "baseballRotoStandings" + year
    );
    const baseballRotoStats = returnMongoCollection("baseballRotoStats" + year);
    const baseballTrifectaStandings = returnMongoCollection(
      "baseballTrifectaStandings" + year
    );

    // Pull and save H2H Standings, Roto Standings, Roto Stats, and Trifecta Standings
    findAndSaveToRedux(
      dispatch,
      actions.saveExistingH2HStandings,
      baseballH2HStandings,
      "h2hTrifectaPoints"
    );
    findAndSaveToRedux(
      dispatch,
      actions.saveExistingRotoStandings,
      baseballRotoStandings,
      "rotoTrifectaPoints"
    );
    findAndSaveToRedux(
      dispatch,
      actions.saveExistingRotoStats,
      baseballRotoStats,
      "R"
    );
    findAndSaveToRedux(
      dispatch,
      actions.saveExistingTrifectaStandings,
      baseballTrifectaStandings,
      "totalTrifectaPoints"
    );
  };
};

const sortTable = standings => {
  return async function(dispatch) {
    dispatch(actions.sortBaseballStandingsTable(standings));
  };
};

export { scrapeBaseballStandings, displayBaseballStandings, sortTable };
