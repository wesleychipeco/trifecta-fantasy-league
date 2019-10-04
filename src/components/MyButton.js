import React, { PureComponent } from "react";
import { TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import { myButtonStyles as styles } from "../styles/globalStyles";

export class MyButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    touchableStyles: PropTypes.object,
    textStyles: PropTypes.object,
  };

  static defaultProps = {
    onPress: () => {},
    touchableStyles: {},
    textStyles: {},
  };

  render() {
    const { title, onPress, touchableStyles, textStyles } = this.props;

    return (
      <TouchableOpacity
        style={[styles.container, touchableStyles]}
        onPress={onPress}
      >
        <Text style={[styles.text, textStyles]}>{title}</Text>
      </TouchableOpacity>
    );
  }
}
