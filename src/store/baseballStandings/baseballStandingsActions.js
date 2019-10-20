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
import { baseballStandingsScraper } from "../../scrapers/baseballStandings";
import { assignRankPoints } from "../../computators/assignRankPoints";
import { sumBaseballRotoPoints } from "../../computators/sumRotoPoints";
import { format } from "date-fns";
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

  return sumBaseballRotoPoints(rotoStandings, "totalPoints");
};

const scrapeBaseballStandings = year => {
  return async function(dispatch) {
    const [
      h2hStandingsScrape,
      rotoStatsScrape,
    ] = await baseballStandingsScraper(year);
    dispatch(actions.scrapeH2HBaseballStandingsStart);
    dispatch(actions.scrapeRotoBaseballStandingsStart);

    const ownerIdsOwnerNamesArray = await retriveOwnerIdsOwnerNamesArray();

    if (h2hStandingsScrape) {
      dispatch(actions.scrapeH2HBaseballStandingsSuccess);
      if (rotoStatsScrape) {
        dispatch(
          actions.setBaseballStandingsLastScraped(
            format(new Date(), "M/D/YY h:mm:ss")
          )
        );
        dispatch(actions.scrapeRotoBaseballStandingsSuccess);
        const rotoStats = [...rotoStatsScrape];

        // H2H Standings
        const h2hStandingsWithoutNames = await assignRankPoints(
          h2hStandingsScrape,
          "winPer",
          "highToLow",
          "h2hTrifectaPoints",
          10,
          1
        );

        const h2hStandings = await addOwnerNames(
          ownerIdsOwnerNamesArray,
          h2hStandingsWithoutNames
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
        const baseballStandingsCollection = returnMongoCollection(
          "baseballStandings"
        );

        const compiledStandings = {
          year,
          trifectaStandings: calculateTrifectaBaseballStandings(
            h2hStandings,
            rotoStandings
          ),
          h2hStandings,
          rotoStandings,
          rotoStats,
        };

        // Save H2H Standings, Roto Standings, Roto Stats, and Trifecta Standings to redux & save once to Mongo
        dispatch(actions.saveScrapedH2HStandings(h2hStandings));
        dispatch(actions.saveScrapedRotoStandings(rotoStandings));
        dispatch(actions.saveScrapedRotoStats(rotoStats));
        dispatch(
          actions.saveScrapedTrifectaStandings(
            calculateTrifectaBaseballStandings(h2hStandings, rotoStandings)
          )
        );

        deleteInsertDispatch(
          null,
          null,
          baseballStandingsCollection,
          year,
          compiledStandings,
          null,
          false
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
      combinedStandings.ownerIds = teamH2H.ownerIds;
      combinedStandings.ownerNames = teamH2H.ownerNames;
      combinedStandings.h2hTrifectaPoints = h2hPoints;
      combinedStandings.rotoTrifectaPoints = rotoPoints;
      combinedStandings.trifectaPoints = h2hPoints + rotoPoints;

      combinedStandingsArray.push(combinedStandings);
    });

    return sortArrayBy(combinedStandingsArray, "trifectaPoints", true);
  }
};

const displayBaseballStandings = (year, sortColumn = "totalTrifectaPoints") => {
  return async function(dispatch) {
    // connect to mongo
    const baseballStandingsCollection = returnMongoCollection(
      "baseballStandings"
    );

    // Pull and save H2H Standings, Roto Standings, Roto Stats, and Trifecta Standings
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingH2HStandings,
      baseballStandingsCollection,
      year,
      "h2hTrifectaPoints",
      "h2hStandings"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingRotoStandings,
      baseballStandingsCollection,
      year,
      "rotoTrifectaPoints",
      "rotoStandings"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingRotoStats,
      baseballStandingsCollection,
      year,
      "R",
      "rotoStats"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingTrifectaStandings,
      baseballStandingsCollection,
      year,
      sortColumn,
      "trifectaStandings"
    );
  };
};

const sortTable = standings => {
  return async function(dispatch) {
    dispatch(actions.sortBaseballStandingsTable(standings));
  };
};

export { scrapeBaseballStandings, displayBaseballStandings, sortTable };
