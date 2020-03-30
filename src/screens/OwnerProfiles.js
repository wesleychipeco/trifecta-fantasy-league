import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { Navbar } from "../components/Navbar";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { getOwnerProfilesStateSelectors } from "../store/ownerProfiles/ownerProfilesReducer";
import { displaySeasonsRecap } from "../store/ownerProfiles/ownerProfilesActions";
import { returnMongoCollection } from "../databaseManagement";
import { standingsStyles as styles } from "../styles/globalStyles";
import { isEmptyArray, sortArrayBy, sum } from "../utils";

export class OwnerProfiles extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      teamNumber: null
    };
  }

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = () => {
    const { navigation } = this.props;

    const teamNumber = navigation.getParam(
      "teamNumber",
      "No team number defined!"
    );
    this.props.displaySeasonsRecap(teamNumber);
  };

  render() {
    const {
      navigation,
      ownerNames,
      trifectaHistory,
      allTimeRecords,
      allTimeBasketball,
      allTimeBaseball,
      allTimeFootball
    } = this.props;

    console.log("trifectaHistory", trifectaHistory);
    console.log("allTimeRecords", allTimeRecords);
    console.log("allTimeBasketball", allTimeBasketball);
    console.log("allTimeBaseball", allTimeBaseball);
    console.log("allTimeFootball", allTimeFootball);
    const emptyCheck =
      isEmptyArray(trifectaHistory) ||
      isEmptyArray(allTimeRecords) ||
      isEmptyArray(allTimeBasketball) ||
      isEmptyArray(allTimeBaseball) ||
      isEmptyArray(allTimeFootball);

    if (emptyCheck) {
      return <LoadingIndicator />;
    }

    const title = `${ownerNames}'s Seasons Recap`;

    const headerRowHeight = 75;

    ///// Trifecta History /////
    const trifectaHistoryHeaderRow = [
      "Year",
      "Basketball Trifecta Points",
      "Baseball Trifecta Points",
      "Football Trifecta Points",
      "Total Trifecta Points"
    ];
    const trifectaHistoryTotalWidth = 500;
    const trifectaHistoryWidthArray = [100, 100, 100, 100, 100];
    const trifectaHistoryTotalHeight = trifectaHistory.length * 50;
    const trifectaHistoryObjectKeys = [
      "year",
      "basketballTrifectaPoints",
      "baseballTrifectaPoints",
      "footballTrifectaPoints",
      "totalTrifectaPoints"
    ];

    ///// All-Time Records /////
    const allTimeRecordsHeaderRow = [
      "Sport",
      "Wins",
      "Losses",
      "Ties",
      "Win %",
      "Avg Roto Pts/Pts For"
    ];
    const allTimeRecordsObjectKeys = [
      "sport",
      "wins",
      "losses",
      "winPer",
      "ties",
      "avgPoints"
    ];
    const allTimeRecordsWidthArray = Array(
      allTimeRecordsObjectKeys.length
    ).fill(100);
    const allTimeRecordsTotalWidth = sum(allTimeRecordsWidthArray);
    const allTimeRecordsTotalHeight = allTimeRecords.length * 50;

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.headerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.table}>
          <Text style={styles.subtext}>Trifecta History</Text>
          <Row
            data={trifectaHistoryHeaderRow}
            height={headerRowHeight}
            totalwidth={trifectaHistoryTotalWidth}
            widthArray={trifectaHistoryWidthArray}
            rowStyle={styles.header}
            numberOfLines={2}
          />
          <Rows
            data={trifectaHistory}
            totalheight={trifectaHistoryTotalHeight}
            totalwidth={trifectaHistoryTotalWidth}
            widthArray={trifectaHistoryWidthArray}
            objectKeys={trifectaHistoryObjectKeys}
            numberOfLines={2}
          />
        </View>
        <View style={styles.table}>
          <Text style={styles.subtext}>All-Time Records</Text>
          <Row
            data={allTimeRecordsHeaderRow}
            height={headerRowHeight}
            totalwidth={allTimeRecordsTotalWidth}
            widthArray={allTimeRecordsWidthArray}
            rowStyle={styles.header}
            numberOfLines={2}
          />
          <Rows
            data={allTimeRecords}
            totalheight={allTimeRecordsTotalHeight}
            totalwidth={allTimeRecordsTotalWidth}
            widthArray={allTimeRecordsWidthArray}
            objectKeys={allTimeRecordsObjectKeys}
            numberOfLines={2}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    getOwnerNames,
    getTrifectaHistory,
    getAllTimeRecords,
    getAllTimeBasketball,
    getAllTimeBaseball,
    getAllTimeFootball
  } = getOwnerProfilesStateSelectors(state);

  return {
    ownerNames: getOwnerNames(),
    trifectaHistory: getTrifectaHistory(),
    allTimeRecords: getAllTimeRecords(),
    allTimeBasketball: getAllTimeBasketball(),
    allTimeBaseball: getAllTimeBaseball(),
    allTimeFootball: getAllTimeFootball()
  };
};

const mapDispatchToProps = {
  displaySeasonsRecap
};

export default connect(mapStateToProps, mapDispatchToProps)(OwnerProfiles);
