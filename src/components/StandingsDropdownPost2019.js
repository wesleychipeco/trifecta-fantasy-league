import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { triggerStyles, optionsStyles } from "../styles/globalStyles";
import { isYear1BeforeYear2 } from "../utils";

export class StandingsDropdownPost2019 extends PureComponent {
  static propTypes = {
    year: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    currentYear: PropTypes.string,
  };

  noop = () => {};

  renderAppropriateDropdownOptions = () => {
    const { year, currentYear, navigation } = this.props;
    if (isYear1BeforeYear2(currentYear, year)) {
      return (
        <Fragment>
          <MenuOption
            onSelect={this.noop}
            text={`${year} Baseball not in-season`}
          />
          <MenuOption
            onSelect={this.noop}
            text={`${year} Football not in-season`}
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <MenuOption
          onSelect={() => navigation.navigate("BaseballStandings", { year })}
          text={`${year} Baseball Standings`}
        />
        <MenuOption
          onSelect={() => navigation.navigate("FootballStandings", { year })}
          text={`${year} Football Standings`}
        />
      </Fragment>
    );
  };

  render() {
    const { navigation, year } = this.props;

    const dropdownText = `+ ${year} standings`;

    return (
      <Menu>
        <MenuTrigger customStyles={triggerStyles} text={dropdownText} />
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption
            onSelect={() => navigation.navigate("TrifectaStandings", { year })}
            text={`${year} Trifecta Standings`}
          />
          <MenuOption
            onSelect={() =>
              navigation.navigate("BasketballStandings", { year })
            }
            text={`${year} Basketball Standings`}
          />
          {this.renderAppropriateDropdownOptions()}
        </MenuOptions>
      </Menu>
    );
  }
}
