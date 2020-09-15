import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { cellStyles as styles } from "../styles/globalStyles";

export class Top5Bottom5Cell extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    flex: PropTypes.number,
    textStyle: PropTypes.object,
    cellStyle: PropTypes.object,
    borderStyle: PropTypes.object,
    numberOfLines: PropTypes.number,
  };
  static defaultProps = {
    numberOfLines: 1,
    borderStyle: {
      borderColor: "#000000",
      borderWidth: 1,
      borderRadius: 0,
    },
  };

  render() {
    const {
      data,
      width,
      height,
      flex,
      cellStyle,
      textStyle,
      borderStyle,
      numberOfLines,
      ...props
    } = this.props;

    // Background color green if in Top 5 that week
    const top5Bottom5BooleanStyling = data.win
      ? { backgroundColor: "#32CD32" }
      : {};

    return (
      <View
        style={[
          styles.cell,
          { width, height, flex },
          cellStyle,
          borderStyle,
          top5Bottom5BooleanStyling,
        ]}
      >
        <Text
          style={[styles.text, textStyle]}
          {...props}
          numberOfLines={numberOfLines}
        >
          {data.points}
        </Text>
      </View>
    );
  }
}
