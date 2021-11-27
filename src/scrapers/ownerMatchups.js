import axios from "axios";

const retrieveSportMatchups = (sport, year, teamNumber) => {
  let url;
  switch (sport) {
    case "basketball":
      // url = `http://fantasy.espn.com/apis/v3/games/fba/seasons/${year}/segments/0/leagues/100660?view=standings`;
      url  = `https://fantasy.espn.com/apis/v3/games/fba/seasons/${year}/segments/0/leagues/100660?view=mMatchupScore`
      break;
    case "baseball":
      url = `http://fantasy.espn.com/apis/v3/games/flb/seasons/${year}/segments/0/leagues/109364?view=standings`;
      break;
    case "football":
      url = `http://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/154802?view=standings`;
      break;
    default:
      url = "";
      break;
  }

  return axios.get(url).then(response => {
    // console.log('RESPONSE', response);
    const fullSchedule = response.data.schedule;
    console.log('fs', fullSchedule)
    const teamNumberArrayIndex = Number(teamNumber) - 1;
    return response.data.teams[teamNumberArrayIndex].record.headToHead;
  });
};

const retrieveFootballPoints = year => {
  const url = `http://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/154802?view=mMatchupScore`;

  return axios.get(url).then(response => {
    const { schedule } = response.data;

    // separate each matchup into weeks of 5 matchups each
    return [
      schedule.slice(0, 5),
      schedule.slice(5, 10),
      schedule.slice(10, 15),
      schedule.slice(15, 20),
      schedule.slice(20, 25),
      schedule.slice(25, 30),
      schedule.slice(30, 35),
      schedule.slice(35, 40),
      schedule.slice(40, 45),
      schedule.slice(45, 50),
      schedule.slice(50, 55),
      schedule.slice(55, 60),
      schedule.slice(60, 65)
    ];
  });
};

export { retrieveSportMatchups, retrieveFootballPoints };
