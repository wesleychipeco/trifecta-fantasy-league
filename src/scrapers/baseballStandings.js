import axios from "axios";

const baseballStandingsScraper = () => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/flb/seasons/2019/segments/0/leagues/109364?view=standings"
    )
    .then(response => {
      const standingsArray = [];

      response.data.teams.forEach(team => {
        standingsArray.push({
          teamName: team.location + " " + team.nickname,
          wins: team.record.overall.wins,
          losses: team.record.overall.losses,
          ties: team.record.overall.ties,
          winPer: team.record.overall.percentage,
        });
      });

      return standingsArray;
    });
};
export { baseballStandingsScraper };
