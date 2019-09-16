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
  let individualPoints, distributedPoints;

  // Initialize factors to determine points if there is a tie
  let pointsHold = [];
  let timesDistributed = 0;
  let heldTiedTeams = [];

  for (let i = 0; i < dataArray.length; i++) {
    // Initialize how many teams tied with current team
    let sameRecords = 0;

    let currentTeamCompareValue = dataArray[i][compareKey];

    for (let j = 0; j < dataArray.length; j++) {
      let compareTeamCompareValue = dataArray[j][compareKey];

      // if 2 teams tied in win per, increase number of teams with same record
      if (currentTeamCompareValue === compareTeamCompareValue) {
        sameRecords += 1;
        if (heldTiedTeams.includes(dataArray[i]) === false)
          heldTiedTeams.push(dataArray[i]);
      }
    }

    // after done with inner loop of all teams to find matches, determine whether to go into tie process or not
    // there will always be at least 1 team with same record (itself), so if > 1, go in to tie process
    if (sameRecords > 1) {
      // when all tied teams are added to array
      let tiedPointsFor;
      // Sort heldTeams by PointsFor
      heldTiedTeams.sort((a, b) => (a["pointsFor"] < b["pointsFor"] ? 1 : -1));
      console.log(sameRecords);
      console.log("heldteams", heldTiedTeams);

      for (let y = 0; y < heldTiedTeams.length; y++) {
        tiedPointsFor = 0;

        let currentTeamPointsFor = heldTiedTeams[y]["pointsFor"];

        for (let z = 0; z < heldTiedTeams.length; z++) {
          let compareTeamPointsFor = heldTiedTeams[z]["pointsFor"];

          if (currentTeamPointsFor === compareTeamPointsFor) {
            tiedPointsFor += 1;
          }
        }
      }
      console.log("tpf", tiedPointsFor);

      if (tiedPointsFor > 1) {
        // if this is the first time finding the tie, initialize distributed tied points
        if (pointsHold.length === 0) {
          // points to be averaged and split are a range of [points - # of other teams tied, points]
          for (
            let k = points - (sameRecords - 1) * pointsIncrement;
            k <= points;
            k += pointsIncrement
          ) {
            pointsHold.push(k);
          }

          // range of points allocated is summed and averaged
          distributedPoints = 0;
          for (let x = 0; x < pointsHold.length; x++) {
            distributedPoints += pointsHold[x];
          }
          distributedPoints /= sameRecords;
        }

        // now that points have been averaged, each tied team gets this same number of points
        individualPoints = distributedPoints;
        timesDistributed += 1;

        // if all tied team's points have been distributed, then reset counts
        if (timesDistributed === sameRecords) {
          pointsHold = [];
          timesDistributed = 0;
        }
      } else {
        console.log("hello");
        heldTiedTeams = [];
        individualPoints = points;
      }
    } else {
      console.log("hi");
      individualPoints = points;
    }

    // at the end of each loop of each team, decrease the number of points
    points -= pointsIncrement;
    console.log("team", dataArray[i].teamName);
    console.log("points", individualPoints);

    dataArray[i][assignKey] = individualPoints;
  }
  return dataArray;
};

export { assignFootballTrifectaPoints };
