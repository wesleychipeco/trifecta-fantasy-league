import React, { PureComponent } from "react";

import axios from "axios";
import round from "lodash/round"

class DynastyBaseballStandings extends PureComponent{
  componentDidMount() {
    axios
    .post(
      `https://www.fantrax.com/fxpa/req?leagueId=2b0xp4cqkk5ztl6x`,
      {
        msgs: [
          { method: "getStandings", data: { view: "ALL"} },
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
      console.log("RESPONSE", response);
      console.log("type", typeof response);
      const h2hStandings = response.data.responses[0].data.tableList;
      console.log('HHHH', h2hStandings)

      const totalStandings = []

      for (let index = 0; index < h2hStandings.length - 1; index++) {
        console.log('each division', h2hStandings[index].subCaption);

        for (let divisionIndex = 0; divisionIndex < h2hStandings[index].rows.length; divisionIndex++) {
          const teamObject = h2hStandings[index].rows[divisionIndex];
          console.log('teamobject', teamObject)

          const standingsObject = {
            teamName: teamObject.fixedCells[1].content,
            wins: teamObject.cells[0].content,
            losses: teamObject.cells[1].content,
            ties: teamObject.cells[2].content,
            winPer: teamObject.cells[3].content,
            gamesBack: teamObject.cells[5].content,
            division: h2hStandings[index].subCaption
          }
          totalStandings.push(standingsObject)
        }
      }

      console.log("TOTAL STANDINGS", totalStandings)
      // const h2hStandingsArray = [];
      // const rotoStatsArray = [];

      // response.data.teams.forEach((team) => {
      //   const teamName = `${team.location} ${team.nickname}`;
      //   const ownerIds = team.owners;
      //   h2hStandingsArray.push({
      //     teamName,
      //     ownerIds,
      //     wins: team.record.overall.wins,
      //     losses: team.record.overall.losses,
      //     ties: team.record.overall.ties,
      //     winPer: round(team.record.overall.percentage, 3),
      //   });

      //   rotoStatsArray.push({
      //     teamName,
      //     ownerIds,
      //     FGPER: round(team.valuesByStat["19"], 4),
      //     FTPER: round(team.valuesByStat["20"], 4),
      //     THREEPM: team.valuesByStat["17"],
      //     REB: team.valuesByStat["6"],
      //     AST: team.valuesByStat["3"],
      //     STL: team.valuesByStat["2"],
      //     BLK: team.valuesByStat["1"],
      //     TO: team.valuesByStat["11"],
      //     PTS: team.valuesByStat["0"],
      //   });
      });

      // return [h2hStandingsArray, rotoStatsArray];
    // });
  }

  render() {
    return (
      <div>
        Hi
      </div>
    )
  }
}

export default DynastyBaseballStandings;