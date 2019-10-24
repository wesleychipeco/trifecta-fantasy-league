import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { triggerStyles, optionsStyles } from "../styles/globalStyles";
import { returnMongoCollection } from "../databaseManagement";

export class MatchupsDropdown extends PureComponent {
  static propTypes = {
    teamNumber: PropTypes.string.isRequired,
    ownerNames: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      yearsArray: [],
    };
  }

  componentDidMount() {
    const ownerMatchupsCollection = returnMongoCollection(
      "owner" + this.props.teamNumber + "Matchups"
    );
    ownerMatchupsCollection
      .find({}, { projection: { _id: 0, year: 1 } })
      .asArray()
      .then(ownerMatchupsYearsArray => {
        // TODO - figure out sort
        ownerMatchupsYearsArray.sort();
        this.setState({
          yearsArray: ownerMatchupsYearsArray,
        });
      });
  }

  renderMatchupsList = (yearObject, index) => {
    const { teamNumber, navigation } = this.props;
    const { year } = yearObject;

    // Conditional for text name depending on year (pre/post 2019)
    return (
      <MenuOption
        key={index}
        onSelect={() => navigation.navigate("Matchups", { year, teamNumber })}
        text={year + " Matchups"}
      />
    );
  };

  render() {
    const { ownerNames } = this.props;
    const dropdownText = `${ownerNames}'s Matchups`;

    return (
      <Menu>
        <MenuTrigger customStyles={triggerStyles} text={dropdownText} />
        <MenuOptions customStyles={optionsStyles}>
          {this.state.yearsArray.map(this.renderMatchupsList)}
        </MenuOptions>
      </Menu>
    );
  }
}
