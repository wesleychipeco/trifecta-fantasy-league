import axios from "axios";
import round from "lodash/round";

const dynastyBaseballStandingsScraper = (year) => {
  return axios
    .post(
      `https://www.fantrax.com/fxpa/req?leagueId=2b0xp4cqkk5ztl6x`,
      {
        msgs: [
          { method: "getStandings", data: { view: "ALL" } },
          { method: "getFantasyLeagueInfo", data: {} },
          { method: "getFantasyTeams", data: {} },
        ],
        ng2: true,
        href:
          "https://www.fantrax.com/fantasy/league/2b0xp4cqkk5ztl6x/standings",
        dt: 0,
        at: 0,
        av: null,
        tz: "America/Los_Angeles",
        v: "19.3.1",
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      console.log("response", response);
      const h2hStandings = response.data.responses[0].data.tableList;
      const totalStandings = [];

      for (let index = 0; index < h2hStandings.length - 1; index++) {
        for (
          let divisionIndex = 0;
          divisionIndex < h2hStandings[index].rows.length;
          divisionIndex++
        ) {
          const teamObject = h2hStandings[index].rows[divisionIndex];
          console.log("teamobject", teamObject);

          const standingsObject = {
            teamName: teamObject.fixedCells[1].content,
            wins: teamObject.cells[0].content,
            losses: teamObject.cells[1].content,
            ties: teamObject.cells[2].content,
            winPer: teamObject.cells[3].content,
            gamesBack: teamObject.cells[5].content,
            division: h2hStandings[index].subCaption,
          };
          totalStandings.push(standingsObject);
        }
      }

      console.log("TOTAL STANDINGS", totalStandings);
      return totalStandings;
    });
};

export { dynastyBaseballStandingsScraper };
