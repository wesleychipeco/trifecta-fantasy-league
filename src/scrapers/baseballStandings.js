import cheerio from "cheerio";
import request from "request";
import axios from "axios";

const baseballStandingsScraper = () => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/flb/seasons/2019/segments/0/leagues/109364?view=standings"
    )
    .then(response => {
      // console.log("$$$", Object.keys(response.data.teams));
      const standingsArray = [];

      response.data.teams.forEach(team => {
        standingsArray.push({
          teamName: team.location + " " + team.nickname,
          wins: team.record.overall.wins,
          losses: team.record.overall.losses,
          ties: team.record.overall.ties,
          winPer: team.record.overall.percentage.toFixed(3),
        });
      });
      console.log(standingsArray);

      return standingsArray;
    });

  // const $ = cheerio.load(
  //   '<ul id="fruits">  <li class="apple aa">Apple</li>    <li class="orange">Orange</li>    <li class="pear">Pear</li> </ul>'
  // );
  // const h = $(".apple");
  // console.log(h.html());
};
export { baseballStandingsScraper };
