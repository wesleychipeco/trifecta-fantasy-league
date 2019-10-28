import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";

import { getTradeHistoryStateSelectors } from "../store/tradeHistory/tradeHistoryReducer";
import {
  displayTradeHistory,
  sortTable,
} from "../store/tradeHistory/tradeHistoryActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/tradeHistory";
import { Navbar } from "../components/Navbar";
import { sortArrayBy } from "../utils";
import { LinkText } from "../components/LinkText";
import { standingsStyles as styles } from "../styles/globalStyles";

class TradeHistory extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sortedColumn: "date",
      highToLow: true,
    };
  }

  componentDidMount() {
    this.props.displayTradeHistory();
  }

  sortTableByColumn = columnKey => {
    const { sortTable, tradeHistory } = this.props;
    const { sortedColumn, highToLow } = this.state;

    const tableArraySorted = [...tradeHistory];

    if (sortedColumn === columnKey) {
      this.setState({
        sortedColumn: columnKey,
        highToLow: !highToLow,
      });
      sortTable(sortArrayBy(tableArraySorted, columnKey, !highToLow));
    } else {
      const columnDefaultSortDirection = tableDefaultSortDirections[columnKey];
      this.setState({
        sortedColumn: columnKey,
        highToLow: columnDefaultSortDirection,
      });
      sortTable(
        sortArrayBy(tableArraySorted, columnKey, columnDefaultSortDirection)
      );
    }
  };

  noop = () => {};

  sortByDate = () => {
    this.sortTableByColumn("date");
  };

  sortByOwner1 = () => {
    this.sortTableByColumn("owner1");
  };

  sortByOwner2 = () => {
    this.sortTableByColumn("owner2");
  };

  renderHeaderRowColumn = ({ title, onPress }) => {
    return (
      <LinkText
        key={title}
        title={title}
        onPress={onPress}
        textStyles={styles.headerText}
      />
    );
  };

  render() {
    const { navigation, tradeHistory } = this.props;

    if (!tradeHistory) {
      return null;
    }

    const headerRowHeight = 75;
    const totalHeight =
      tradeHistory.length > 1 ? tradeHistory.length * 75 : 500;
    const totalWidth = 900;
    const widthArray = [100, 200, 200, 200, 200];
    const objectKeys = [
      "date",
      "owner1",
      "owner1PlayersReceived",
      "owner2",
      "owner2PlayersReceived",
    ];

    const headerRowMap = [
      { title: "Date", onPress: this.sortByDate },
      { title: "Owner 1", onPress: this.sortByOwner1 },
      { title: "Players Received", onPress: this.noop },
      { title: "Owner 2", onPress: this.sortByOwner2 },
      { title: "Players Received", onPress: this.noop },
    ];

    const headerRow = headerRowMap.map(this.renderHeaderRowColumn);
    const title = "Trifecta All-Time Trade History!";

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.table}>
          <Row
            data={headerRow}
            height={headerRowHeight}
            totalWidth={totalWidth}
            widthArray={widthArray}
            rowStyle={styles.header}
          />
          <Rows
            data={tradeHistory}
            totalheight={totalHeight}
            totalwidth={totalWidth}
            widthArray={widthArray}
            objectKeys={objectKeys}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { getTradeHistory } = getTradeHistoryStateSelectors(state);

  return {
    tradeHistory: getTradeHistory(),
  };
};

const mapDispatchToProps = {
  displayTradeHistory,
  sortTable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TradeHistory);
