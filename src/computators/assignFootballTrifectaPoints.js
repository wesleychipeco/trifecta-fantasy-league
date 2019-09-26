import { sortArrayBy } from "../utils";

const assignFootballTrifectaPoints = (
  dataArray,
  compareKey,
  sortDirection,
  assignKey,
  totalPoints,
  pointsIncrement
) => {
  sortDirection === "highToLow"
    ? dataArray.sort((a, b) => (a[compareKey] < b[compareKey] ? 1 : -1))
    : dataArray.sort((a, b) => (a[compareKey] > b[compareKey] ? 1 : -1));

  // Starting value for points to give out
  let points = totalPoints;
  let individualPoints;

  // Initialize factors to determine points if there is a tie
  let tiedTeams = [];
  let tiedTeamsPointsHold = [];
  let tiedTeamsTimesDistributed = 0;

  for (let i = 0; i < dataArray.length; i++) {
    // Initialize how many teams tied with current team
    let sameRecords = 0;

    let currentTeamCompareValue = dataArray[i][compareKey];

    for (let j = 0; j < dataArray.length; j++) {
      let compareTeamCompareValue = dataArray[j][compareKey];

      // if 2 teams tied in win per, increase number of teams with same record
      // Add to tiedTeams array, do not duplicate
      if (currentTeamCompareValue === compareTeamCompareValue) {
        sameRecords += 1;
        if (tiedTeams.includes(dataArray[i]) === false)
          tiedTeams.push(dataArray[i]);
        if (tiedTeams.includes(dataArray[j]) === false)
          tiedTeams.push(dataArray[j]);
      }
    }

    // after done with inner loop of all teams to find matches, determine whether to go into tie process or not
    // there will always be at least 1 team with same record (itself), so if > 1, go in to tie process
    if (sameRecords > 1) {
      // If first time that there is a tie and tiedTeamsPointsHold array needs to be set
      if (tiedTeamsPointsHold.length === 0) {
        // points to be held and distributed in PointsFor order are a range of [points, points - # of other teams tied]
        for (
          let k = points;
          k >= points - (sameRecords - 1) * pointsIncrement;
          k -= pointsIncrement
        ) {
          tiedTeamsPointsHold.push(k);
        }
      }

      // sort tiedTeams from highToLow pointsFor
      tiedTeams.sort((a, b) => (a["pointsFor"] < b["pointsFor"] ? 1 : -1));

      // Set the array index (sorted order) of given team (dataArray[i])
      const sortedIndex = tiedTeams.findIndex(team => team === dataArray[i]);

      // NOTE: CAN'T HANDLE TIE BETWEEN TEAMS WITH SAME RECORD AND SAME POINTS FOR

      // assign points based off of sorted tiedTeams by PF and held points from most to least
      individualPoints = tiedTeamsPointsHold[sortedIndex];
      tiedTeamsTimesDistributed += 1;

      // If all teams who are tied have been distributed, reset initializing variables
      if (tiedTeamsTimesDistributed === sameRecords) {
        tiedTeams = [];
        tiedTeamsPointsHold = [];
        tiedTeamsTimesDistributed = 0;
      }
    }
    // else no same records, distribute points
    else {
      individualPoints = points;
      tiedTeams = [];
    }

    // at the end of each loop of each team, decrease the number of points
    points -= pointsIncrement;
    // console.log("team", dataArray[i].teamName);
    // console.log("points", individualPoints);

    dataArray[i][assignKey] = individualPoints;
  }
  // return sorted array by trifectaPoints
  return sortArrayBy(dataArray, assignKey, "highToLow");
};

export { assignFootballTrifectaPoints };
