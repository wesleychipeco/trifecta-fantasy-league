import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

export class StandingsDropdown extends PureComponent {
  static propTypes = {
    year: PropTypes.string.isRequired,
    navigation: PropTypes.func.isRequired,
  };

  render() {
    const { navigation, year } = this.props;

    const dropdownText = year + " Standings";

    return (
      <Menu>
        <MenuTrigger customStyles={triggerStyles} text={dropdownText} />
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption
            onSelect={() => navigation.navigate("TrifectaStandings", { year })}
            text={year + " Trifecta Standings"}
          />
          <MenuOption
            onSelect={() =>
              navigation.navigate("BasketballStandings", { year })
            }
            text={year + " Basketball Standings"}
          />
          <MenuOption
            onSelect={() => navigation.navigate("BaseballStandings", { year })}
            text={year + " Baseball Standings"}
          />
          <MenuOption
            onSelect={() => navigation.navigate("FootballStandings", { year })}
            text={year + " Football Standings"}
          />
        </MenuOptions>
      </Menu>
    );
  }
}

const triggerStyles = {
  /*
    - triggerOuterWrapper
    - triggerWrapper
    - triggerText
    - triggerTouchable
  */
  triggerOuterWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF0000",
    borderWidth: 3,
    borderColor: "#000000",
  },
  // triggerWrapper: {
  //   flex: 1,
  //   backgroundColor: "blue",
  //   margin: 2,
  // },
  triggerText: {
    color: "white",
  },
};

const optionsStyles = {
  /*
    - optionsWrapper
    - optionsContainer
    - optionWrapper
    - optionText
    - optionTouchable
  */
  optionsWrapper: {
    borderWidth: 3,
    borderColor: "green",
  },
  optionWrapper: {
    backgroundColor: "#66cccc",
  },
};
