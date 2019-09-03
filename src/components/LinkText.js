import React, { PureComponent } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export class LinkText extends PureComponent {
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
