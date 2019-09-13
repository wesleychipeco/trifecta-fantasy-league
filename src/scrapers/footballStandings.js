import axios from "axios";
import round from "lodash/round";

const footballStandingsScraper = () => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/154802?view=standings"
    )
    .then(response => {
      const standingsArray = [];

      response.data.teams.forEach(team => {
        standingsArray.push({
          teamName: team.location + " " + team.nickname,
          wins: team.record.overall.wins,
          losses: team.record.overall.losses,
          ties: team.record.overall.ties,
          winPer: round(team.record.overall.percentage, 3),
          pointsFor: round(team.record.overall.pointsFor, 1),
          pointsAgainst: round(team.record.overall.pointsAgainst, 1),
        });
      });

      return standingsArray;
    });
};

export { footballStandingsScraper };
