import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { triggerStyles, optionsStyles } from "../styles/globalStyles";

export class StandingsDropdownPre2019 extends PureComponent {
  static propTypes = {
    year1: PropTypes.string.isRequired,
    year2: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const { navigation, year1, year2 } = this.props;

    const dropdownText = "+ " + year1 + "-" + year2 + " Standings";

    return (
      <Menu>
        <MenuTrigger customStyles={triggerStyles} text={dropdownText} />
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption
            onSelect={() =>
              navigation.navigate("TrifectaStandings", { year: year2 })
            }
            text={year1 + "-" + year2 + " Trifecta Standings"}
          />
          <MenuOption
            onSelect={() =>
              navigation.navigate("FootballStandings", { year: year1 })
            }
            text={year1 + " Football Standings"}
          />
          <MenuOption
            onSelect={() =>
              navigation.navigate("BasketballStandings", { year: year2 })
            }
            text={year2 + " Basketball Standings"}
          />
          <MenuOption
            onSelect={() =>
              navigation.navigate("BaseballStandings", { year: year2 })
            }
            text={year2 + " Baseball Standings"}
          />
        </MenuOptions>
      </Menu>
    );
  }
}
