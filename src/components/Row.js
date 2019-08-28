import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { sum } from "../utils";
import { Cell } from "./Cell";

export class Row extends Component {
  // totalHeight: sets the outer "table" height independent of each row height
  //    - not required. If not set, sum heightArray
  // heightArray: sets each row's height
  //    - not required. If not set, then equally divide totalHeight amongst all rows
  // HEIGHT: One of either totalHeight or heightArray must be set

  // WIDTH: one of totalWidth or widthArray needs to be set (flexArray can be set with totalWidth)
  // totalWidth: sets the total width of the table
  //    - not required. IF not set, then sum widthArray
  // widthArray: sets each column's width
  //    - not required. If not set, then equally divide totalWidth amongst all columns
  // flexArray: sets each column's flex
  //    - not required. If not set, then use width array, else, use 1 to equally divide amongst totalWidth
  render() {
    const {
      data,
      height,
      rowStyle,
      totalWidth,
      widthArray,
      flexArray,
      textStyle,
      cellStyle,
      ...props
    } = this.props;

    const width = widthArray ? sum(widthArray) : widthArray;
    if (data) {
      return (
        <View
          style={[
            { height, width },
            RowStyles.row,
            rowStyle,
            { backgroundColor: "#FFF" },
          ]}
        >
          {data.map((cell, i) => {
            const cellFlex = flexArray ? flexArray[i] : widthArray ? null : 1;
            const cellWidth = widthArray
              ? widthArray[i]
              : totalWidth / data.length;
            console.log(cellFlex);
            return (
              <Cell
                key={i}
                data={cell}
                height={height}
                width={cellWidth}
                flex={cellFlex}
                textStyle={textStyle}
                cellStyle={cellStyle}
                {...props}
              ></Cell>
            );
          })}
        </View>
      );
    }
    return null;
  }
}

export class Rows extends Component {
  render() {
    const {
      data,
      totalHeight,
      heightArray,
      flexArray,
      totalWidth,
      widthArray,
      rowsStyle,
      rowStyle,
      cellStyle,
      textStyle,
      ...props
    } = this.props;

    const height = totalHeight ? totalHeight : sum(heightArray);
    const width = totalWidth ? totalWidth : sum(widthArray);

    if (data) {
      return (
        <View
          style={{
            width,
            height,
            ...rowsStyle,
            backgroundColor: "#FF0000",
            ...RowStyles.rows,
          }}
        >
          {data.map((row, i) => {
            const rowHeight = heightArray
              ? heightArray[i]
              : totalHeight / data.length;
            return (
              <Row
                key={i}
                data={row}
                height={rowHeight}
                totalWidth={totalWidth}
                widthArray={widthArray}
                flexArray={flexArray}
                rowStyle={rowStyle}
                textStyle={textStyle}
                cellStyle={cellStyle}
                {...props}
              ></Row>
            );
          })}
        </View>
      );
    }
    return null;
  }
}

const RowStyles = StyleSheet.create({
  rows: {
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
});
