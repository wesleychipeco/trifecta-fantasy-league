import { createAction } from "redux-starter-kit";
import {
  SCRAPE_FOOTBALL_STANDINGS_START,
  SCRAPE_FOOTBALL_STANDINGS_SUCCESS,
  SCRAPE_FOOTBALL_STANDINGS_FAILED,
  SAVE_SCRAPED_H2H_STANDINGS,
  SAVE_EXISTING_H2H_STANDINGS,
  SAVE_SCRAPED_TOP5_BOTTOM5_STANDINGS,
  SAVE_EXISTING_TOP5_BOTTOM5_STANDINGS,
  SAVE_SCRAPED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SAVE_EXISTING_FOOTBALL_STANDINGS,
  SORT_FOOTBALL_STANDINGS_TABLE,
  SET_FOOTBALL_STANDINGS_LAST_SCRAPED,
} from "./footballStandingsActionTypes";
import { footballStandingsScraper } from "../../scrapers/footballStandings";
import { format } from "date-fns";
import { assignRankPoints } from "../../computators/assignRankPoints";
import { calculateTop5Bottom5Standings } from "../../computators/compileTop5Bottom5Standings";
import {
  deleteInsertDispatch,
  returnMongoCollection,
  findFromMongoSaveToRedux,
} from "../../databaseManagement";
import {
  retriveOwnerIdsOwnerNamesArray,
  addOwnerNames,
  returnOwnerNamesUnderscored,
} from "../../computators/addOwnerNames";
import { sortArrayBy, isYear1BeforeYear2 } from "../../utils";

const actions = {
  scrapeFootballStandingsStart: createAction(SCRAPE_FOOTBALL_STANDINGS_START),
  scrapeFootballStandingsSuccess: createAction(
    SCRAPE_FOOTBALL_STANDINGS_SUCCESS
  ),
  scrapeFootballStandingsFailed: createAction(SCRAPE_FOOTBALL_STANDINGS_FAILED),
  saveScrapedH2HStandings: createAction(SAVE_SCRAPED_H2H_STANDINGS),
  saveExistingH2HStandings: createAction(SAVE_EXISTING_H2H_STANDINGS),
  saveScrapedTop5Bottom5Standings: createAction(
    SAVE_SCRAPED_TOP5_BOTTOM5_STANDINGS
  ),
  saveExistingTop5Bottom5Standings: createAction(
    SAVE_EXISTING_TOP5_BOTTOM5_STANDINGS
  ),
  saveScrapedTrifectaStandings: createAction(SAVE_SCRAPED_TRIFECTA_STANDINGS),
  saveExistingTrifectaStandings: createAction(SAVE_EXISTING_TRIFECTA_STANDINGS),
  saveExistingFootballStandings: createAction(SAVE_EXISTING_FOOTBALL_STANDINGS),
  sortFootballStandingsTable: createAction(SORT_FOOTBALL_STANDINGS_TABLE),
  setFootballStandingsLastScraped: createAction(
    SET_FOOTBALL_STANDINGS_LAST_SCRAPED
  ),
};

const calculateFootballTrifectaPoints = (
  h2hStandings,
  top5Bottom5Standings
) => {
  if (h2hStandings.length > 0 && top5Bottom5Standings.length > 0) {
    const combinedStandingsArray = [];

    // Loop through each H2H standings, each team
    for (let i = 0; i < h2hStandings.length; i++) {
      const team = h2hStandings[i];

      const combinedStandings = {};
      const { teamName } = team;

      const teamH2H = h2hStandings.find(
        (h2hLoopingTeam) => h2hLoopingTeam.teamName === teamName
      );

      const teamTop5Bottom5 = top5Bottom5Standings.find(
        (top5Bottom5LoopingTeam) => top5Bottom5LoopingTeam.teamName === teamName
      );

      const h2hPoints = teamH2H.h2hTrifectaPoints;
      const top5Bottom5Points = teamTop5Bottom5.top5Bottom5TrifectaPoints;

      combinedStandings.teamName = teamH2H.teamName;
      combinedStandings.ownerIds = teamH2H.ownerIds;
      combinedStandings.ownerNames = teamH2H.ownerNames;
      combinedStandings.h2hTrifectaPoints = h2hPoints;
      combinedStandings.top5Bottom5TrifectaPoints = top5Bottom5Points;
      combinedStandings.trifectaPoints = h2hPoints + top5Bottom5Points;

      combinedStandingsArray.push(combinedStandings);
    }

    return sortArrayBy(combinedStandingsArray, "trifectaPoints", true);
  }
};

const scrapeFootballStandings = (year) => {
  return async function (dispatch) {
    const h2hStandingsScrape = await footballStandingsScraper(year);
    const ownerIdsOwnerNamesArray = await retriveOwnerIdsOwnerNamesArray();
    dispatch(actions.scrapeFootballStandingsStart);

    if (h2hStandingsScrape) {
      dispatch(
        actions.setFootballStandingsLastScraped(
          format(new Date(), "M/D/YY h:mm:ss")
        )
      );
      dispatch(actions.scrapeFootballStandingsSuccess);

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

      // Top 5, Bottom 5 Standings
      const top5Bottom5Collection = await returnMongoCollection(
        "footballTop5Bottom5Totals"
      );
      const top5Bottom5Totals = await top5Bottom5Collection
        .find({ year }, { projection: { _id: 0 } })
        .asArray();

      const ownerNamesUnderscoredObject = returnOwnerNamesUnderscored(
        h2hStandings
      );

      const unrankedTop5Bottom5Standings = calculateTop5Bottom5Standings(
        top5Bottom5Totals[0].top5Bottom5TotalsObject,
        ownerNamesUnderscoredObject
      );

      const top5Bottom5Standings = await assignRankPoints(
        unrankedTop5Bottom5Standings,
        "winPer",
        "highToLow",
        "top5Bottom5TrifectaPoints",
        10,
        1
      );

      // Trifecta Standings
      const trifectaStandings = await calculateFootballTrifectaPoints(
        h2hStandings,
        top5Bottom5Standings
      );

      const footballStandingsCollection = await returnMongoCollection(
        "footballStandings"
      );

      const compiledStandings = {
        year,
        h2hStandings,
        top5Bottom5Standings,
        trifectaStandings,
      };

      // Save H2H Standings, Roto Standings, Roto Stats, and Trifecta Standings to redux & save once to Mongo
      dispatch(actions.saveScrapedH2HStandings(h2hStandings));
      dispatch(actions.saveScrapedTop5Bottom5Standings(top5Bottom5Standings));
      dispatch(actions.saveScrapedTrifectaStandings(trifectaStandings));

      deleteInsertDispatch(
        null,
        null,
        footballStandingsCollection,
        year,
        compiledStandings,
        null,
        false
      );
    } else {
      dispatch(actions.scrapeFootballStandingsFailed);
    }
  };
};

const displayFootballStandings = (year, sortColumn = "totalTrifectaPoints") => {
  return async function (dispatch) {
    const footballStandingsCollection = await returnMongoCollection(
      "footballStandings"
    );

    if (isYear1BeforeYear2(year, "2020")) {
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingFootballStandings,
        footballStandingsCollection,
        year,
        sortColumn,
        "footballStandings"
      );
    } else {
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingH2HStandings,
        footballStandingsCollection,
        year,
        "h2hTrifectaPoints",
        "h2hStandings"
      );
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingTop5Bottom5Standings,
        footballStandingsCollection,
        year,
        "top5Bottom5TrifectaPoints",
        "top5Bottom5Standings"
      );
      findFromMongoSaveToRedux(
        dispatch,
        actions.saveExistingTrifectaStandings,
        footballStandingsCollection,
        year,
        sortColumn,
        "trifectaStandings"
      );
    }
  };
};

const sortTable = (standings) => {
  return async function (dispatch) {
    dispatch(actions.sortFootballStandingsTable(standings));
  };
};

export { scrapeFootballStandings, displayFootballStandings, sortTable };
