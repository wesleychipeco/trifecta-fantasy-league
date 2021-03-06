const tableDefaultSortDirections = {
  trifectaStandings: {
    h2hTrifectaPoints: true,
    rotoTrifectaPoints: true,
    trifectaPoints: true,
    playoffPoints: true,
    totalTrifectaPoints: true,
  },
  h2hStandings: {
    wins: true,
    losses: true,
    ties: true,
    winPer: true,
    h2hTrifectaPoints: true,
  },
  rotoStandings: {
    RPoints: true,
    HRPoints: true,
    RBIPoints: true,
    KPoints: true,
    SBPoints: true,
    OBPPoints: true,
    SOPoints: true,
    QSPoints: true,
    WPoints: true,
    SVPoints: true,
    ERAPoints: true,
    WHIPPoints: true,
    totalPoints: true,
    rotoTrifectaPoints: true,
  },
  rotoStats: {
    R: true,
    HR: true,
    RBI: true,
    K: false,
    SB: true,
    OBP: true,
    SO: true,
    QS: true,
    W: true,
    SV: true,
    ERA: false,
    WHIP: false,
  },
};

export { tableDefaultSortDirections };
