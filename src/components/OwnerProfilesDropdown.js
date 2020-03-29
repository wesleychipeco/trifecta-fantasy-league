import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";
import { triggerStyles, optionsStyles } from "../styles/globalStyles";

export class OwnerProfilesDropdown extends PureComponent {
  static propTypes = {
    teamNumber: PropTypes.number.isRequired,
    ownerNames: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired
  };

  render() {
    const { navigation, ownerNames } = this.props;
    const dropdownText = `+ ${ownerNames}'s Owner Profile`;

    return (
      <Menu>
        <MenuTrigger customStyles={triggerStyles} text={dropdownText} />
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption
            onSelect={() => console.log("Press - Seasons Recap")}
            text="Seasons Recap"
          />
          <MenuOption
            onSelect={() => console.log("Press - Trophy Case")}
            text="Trophy Case"
          />
        </MenuOptions>
      </Menu>
    );
  }
}
