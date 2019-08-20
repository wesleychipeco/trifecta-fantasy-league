import cheerio from "cheerio";
import request from "request";
import axios from "axios";

const baseballStandingsScraper = () => {
  return axios
    .get(
      "https://cors-anywhere.herokuapp.com/https://fantasy.espn.com/baseball/league/standings?leagueId=109364"
    )
    .then(response => {
      const $ = cheerio.load(response.data);
      const h2h = $("div[aria-label=Standings]");
      console.log("$$$", h2h.text());
      return h2h.text();
    });
};
export { baseballStandingsScraper };
