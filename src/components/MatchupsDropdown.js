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
import { sortArrayBy, isYear1BeforeYear2 } from "../utils";

export class MatchupsDropdown extends PureComponent {
  static propTypes = {
    teamNumber: PropTypes.string.isRequired,
    ownerNames: PropTypes.string,
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      yearsArray: [],
    };
  }

  async componentDidMount() {
    const ownerMatchupsCollection = await returnMongoCollection(
      `owner${this.props.teamNumber}Matchups`
    );
    ownerMatchupsCollection
      .find({}, { projection: { _id: 0, year: 1 } })
      .asArray()
      .then((ownerMatchupsYearsArray) => {
        // If this owner does not have any matchups yet, then first season. Add to years array the current year
        if (ownerMatchupsYearsArray.length > 0) {
          this.setState({
            yearsArray: sortArrayBy(ownerMatchupsYearsArray, "year", true),
          });
        } else {
          const seasonVariablesCollection = returnMongoCollection(
            "seasonVariables"
          ).then(() => {
            seasonVariablesCollection
              .find({}, { projection: { _id: 0 } })
              .asArray()
              .then((seasonVariables) => {
                this.setState({
                  yearsArray: [{ year: seasonVariables[0].currentYear }],
                });
              });
          });
        }
      });
  }

  convertSubtractRevert = (year2) => {
    const year1 = Number(year2) - 1;
    return [year1.toString(), year2.toString()];
  };

  renderMatchupsList = (yearObject, index) => {
    const { teamNumber, navigation } = this.props;
    const { year } = yearObject;

    let title;
    if (year === "all") {
      title = `All-Time Matchups`;
    } else {
      // Conditional for text name depending on year (pre/post 2019)
      title = isYear1BeforeYear2(year, "2019")
        ? `${this.convertSubtractRevert(year).join(" - ")} Matchups`
        : `${year} Matchups`;
    }

    return (
      <MenuOption
        key={index}
        onSelect={() => navigation.navigate("Matchups", { year, teamNumber })}
        text={title}
      />
    );
  };

  render() {
    const { ownerNames } = this.props;
    const dropdownText = ownerNames
      ? `+ ${ownerNames}'s Matchups`
      : "+ Switch Year";

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
