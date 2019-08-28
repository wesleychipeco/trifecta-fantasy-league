import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export class Cell extends Component {
  static defaultProps = {
    numberOfLines: 1,
    borderStyle: {
      borderColor: "#000000",
      borderWidth: 2,
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

    const textDom = React.isValidElement(data) ? (
      data
    ) : (
      <Text
        style={[styles.text, textStyle]}
        {...props}
        numberOfLines={numberOfLines}
      >
        {data}
      </Text>
    );

    return (
      <View
        style={[styles.cell, { width, height, flex }, cellStyle, borderStyle]}
      >
        {textDom}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cell: { justifyContent: "center", alignItems: "center" },
  text: { backgroundColor: "transparent" },
});
