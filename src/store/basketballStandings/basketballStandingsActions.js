import { createAction } from "redux-starter-kit";
import {
  SCRAPE_BASKETBALL_STANDINGS_START,
  SCRAPE_BASKETBALL_STANDINGS_SUCCESS,
  SCRAPE_BASKETBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_H2H_STANDINGS,
  SAVE_SCRAPED_ROTO_STATS,
  SAVE_SCRAPED_ROTO_STANDINGS,
  SAVE_SCRAPED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_H2H_STANDINGS,
  SAVE_EXISTING_ROTO_STATS,
  SAVE_EXISTING_ROTO_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SAVE_EXISTING_BASKETBALL_STANDINGS,
  SORT_BASKETBALL_STANDINGS_TABLE,
  SET_BASKETBALL_STANDINGS_LAST_SCRAPED,
} from "./basketballStandingsActionTypes";
import { basketballStandingsScraper } from "../../scrapers/basketballStandings";
import { format } from "date-fns";
import {
  returnMongoCollection,
  findFromMongoSaveToRedux,
  deleteInsertDispatch,
} from "../../databaseManagement";
import { assignRankPoints } from "../../computators/assignRankPoints";
import { sumBasketballRotoPoints } from "../../computators/sumRotoPoints";
import {
  retriveOwnerIdsOwnerNamesArray,
  addOwnerNames,
} from "../../computators/addOwnerNames";
import { sortArrayBy, isYear1BeforeYear2 } from "../../utils";

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
  saveScrapedH2HStandings: createAction(SAVE_SCRAPED_H2H_STANDINGS),
  saveScrapedRotoStats: createAction(SAVE_SCRAPED_ROTO_STATS),
  saveScrapedRotoStandings: createAction(SAVE_SCRAPED_ROTO_STANDINGS),
  saveScrapedTrifectaStandings: createAction(SAVE_SCRAPED_TRIFECTA_STANDINGS),
  saveExistingH2HStandings: createAction(SAVE_EXISTING_H2H_STANDINGS),
  saveExistingRotoStats: createAction(SAVE_EXISTING_ROTO_STATS),
  saveExistingRotoStandings: createAction(SAVE_EXISTING_ROTO_STANDINGS),
  saveExistingTrifectaStandings: createAction(SAVE_EXISTING_TRIFECTA_STANDINGS),
  saveExistingBasketballStandings: createAction(
    SAVE_EXISTING_BASKETBALL_STANDINGS
  ),
  sortBasketballStandingsTable: createAction(SORT_BASKETBALL_STANDINGS_TABLE),
  setBasketballStandingsLastScraped: createAction(
    SET_BASKETBALL_STANDINGS_LAST_SCRAPED
  ),
};

const assignRotoCategoryPoints = (rotoStats) => {
  const rotoCategoriesArray = [
    { category: "FGPER", sortDirection: "highToLow" },
    { category: "FTPER", sortDirection: "highToLow" },
    { category: "THREEPM", sortDirection: "highToLow" },
    { category: "REB", sortDirection: "highToLow" },
    { category: "AST", sortDirection: "highToLow" },
    { category: "STL", sortDirection: "highToLow" },
    { category: "BLK", sortDirection: "highToLow" },
    { category: "TO", sortDirection: "lowToHigh" },
    { category: "PTS", sortDirection: "highToLow" },
  ];

  for (const rotoCategory of rotoCategoriesArray) {
    rotoStats = assignRankPoints(
      rotoStats,
      rotoCategory.category,
      rotoCategory.sortDirection,
      rotoCategory.category + "Points",
      10,
      1
    );
  }

  return sumBasketballRotoPoints(rotoStats, "totalPoints");
};

const calculateTrifectaBasketballStandings = (h2hStandings, rotoStandings) => {
  if (h2hStandings.length > 0 && rotoStandings.length > 0) {
    const combinedStandingsArray = [];

    // Loop through H2H Standings, each team
    h2hStandings.forEach((team) => {
      const combinedStandings = {};
      const { teamName } = team;

      const teamH2H = h2hStandings.find(
        (h2hLoopingTeam) => h2hLoopingTeam.teamName === teamName
      );

      const teamRoto = rotoStandings.find(
        (rotoLoopingTeam) => rotoLoopingTeam.teamName === teamName
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

const scrapeBasketballStandings = (year) => {
  return async function (dispatch) {
    dispatch(actions.scrapeBasketballStandingsStart);
    const [
      h2hStandingsScrape,
      rotoStatsScrape,
    ] = await basketballStandingsScraper(year);

    const ownerIdsOwnerNamesArray = await retriveOwnerIdsOwnerNamesArray();

    if (h2hStandingsScrape && rotoStatsScrape) {
      dispatch(
        actions.setBasketballStandingsLastScraped(
          format(new Date(), "M/D/YY h:mm:ss")
        )
      );
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
      const rotoStandingsWithoutRotoPoints = assignRotoCategoryPoints(
        rotoStatsScrape
      );
      const rotoStandings = await assignRankPoints(
        rotoStandingsWithoutRotoPoints,
        "totalPoints",
        "highToLow",
        "rotoTrifectaPoints",
        10,
        1
      );

      // Trifecta Standings
      const trifectaStandings = await calculateTrifectaBasketballStandings(
        h2hStandings,
        rotoStandings
      );

      // connect to Mongo
      const basketballStandingsCollection = await returnMongoCollection(
        "basketballStandings"
      );

      const compiledStandings = {
        year,
        trifectaStandings,
        h2hStandings,
        rotoStandings,
        rotoStats,
      };

      // Save all standings to redux individually and save to Mongo db once
      dispatch(actions.saveScrapedH2HStandings(h2hStandings));
      dispatch(actions.saveScrapedRotoStandings(rotoStandings));
      dispatch(actions.saveScrapedRotoStats(rotoStats));
      dispatch(actions.saveScrapedTrifectaStandings(trifectaStandings));

      deleteInsertDispatch(
        null,
        null,
        basketballStandingsCollection,
        year,
        compiledStandings,
        null,
        false
      );
      dispatch(actions.scrapeBasketballStandingsSuccess);
    } else {
      dispatch(actions.scrapeBasketballStandingsFailed);
    }
  };
};

const displayBasketballStandings = (
  year,
  sortColumn = "totalTrifectaPoints"
) => {
  return async function (dispatch) {
    // connect to mongo
    const basketballStandingsCollection = await returnMongoCollection(
      "basketballStandings"
    );

    if (isYear1BeforeYear2(year, "2020")) {
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingBasketballStandings,
        basketballStandingsCollection,
        year,
        sortColumn,
        "basketballStandings"
      );
    } else {
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingH2HStandings,
        basketballStandingsCollection,
        year,
        "h2hTrifectaPoints",
        "h2hStandings"
      );
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingRotoStandings,
        basketballStandingsCollection,
        year,
        "rotoTrifectaPoints",
        "rotoStandings"
      );
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingRotoStats,
        basketballStandingsCollection,
        year,
        "PTS",
        "rotoStats"
      );
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingTrifectaStandings,
        basketballStandingsCollection,
        year,
        sortColumn,
        "trifectaStandings"
      );
    }
  };
};

const sortTable = (standings) => {
  return async function (dispatch) {
    dispatch(actions.sortBasketballStandingsTable(standings));
  };
};

export { scrapeBasketballStandings, displayBasketballStandings, sortTable };
