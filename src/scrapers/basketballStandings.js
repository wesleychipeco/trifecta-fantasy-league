import axios from "axios";
import round from "lodash/round";

const basketballStandingsScraper = () => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/fba/seasons/2019/segments/0/leagues/100660?view=standings"
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
        });
      });

      return standingsArray;
    });
};

export { basketballStandingsScraper };
