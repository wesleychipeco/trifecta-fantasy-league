import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { sum } from "../utils";
import { Cell } from "./Cell";
import { rowStyles as styles } from "../styles/globalStyles";
import { Top5Bottom5Cell } from "./Top5Bottom5Cell";

export class Row extends PureComponent {
  // totalheight: sets the outer "table" height independent of each row height
  //    - not required. If not set, sum heightArray
  // heightArray: sets each row's height
  //    - not required. If not set, then equally divide totalheight amongst all rows
  // HEIGHT: One of either totalheight or heightArray must be set

  // WIDTH: one of totalwidth or widthArray needs to be set (flexArray can be set with totalwidth)
  // totalwidth: sets the total width of the table
  //    - not required. IF not set, then sum widthArray
  // widthArray: sets each column's width
  //    - not required. If not set, then equally divide totalwidth amongst all columns
  // flexArray: sets each column's flex
  //    - not required. If not set, then use width array, else, use 1 to equally divide amongst totalwidth

  // OBJECTKEYS: ordered array of keys that each column will be displayed in
  //    - required in order of column display

  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    objectKeys: PropTypes.array,
    height: PropTypes.number.isRequired,
    totalwidth: PropTypes.number,
    widthArray: PropTypes.array,
    flexArray: PropTypes.array,
    rowStyle: PropTypes.object,
    top3StylingIndex: PropTypes.number,
  };

  render() {
    const {
      data,
      objectKeys,
      height,
      totalwidth,
      widthArray,
      flexArray,
      rowStyle,
      top3StylingIndex,
      ...props
    } = this.props;

    const width = widthArray ? sum(widthArray) : widthArray;

    let top3Style = {};
    if (top3StylingIndex || top3StylingIndex === 0) {
      switch (top3StylingIndex) {
        case 0:
          top3Style = { backgroundColor: "#FFD700" };
          break;
        case 1:
          top3Style = { backgroundColor: "#C0C0C0" };
          break;
        case 2:
          top3Style = { backgroundColor: "#CD7F32" };
          break;
        default:
          break;
      }
    }

    if (data) {
      // If there are objectKeys, use them to pull data from object
      if (objectKeys) {
        return (
          <View style={[{ height, width }, styles.row, rowStyle, top3Style]}>
            {objectKeys.map((objectKey, i) => {
              const cellFlex = flexArray ? flexArray[i] : widthArray ? null : 1;
              const cellWidth = widthArray
                ? widthArray[i]
                : totalwidth / data.length;
              // For Top5 Bottom5
              if (typeof data[objectKey] === "object") {
                return (
                  <Top5Bottom5Cell
                    key={i}
                    data={data[objectKey]}
                    height={height}
                    width={cellWidth}
                    flex={cellFlex}
                    {...props}
                  />
                );
              }
              return (
                <Cell
                  key={i}
                  data={data[objectKey]}
                  height={height}
                  width={cellWidth}
                  flex={cellFlex}
                  {...props}
                ></Cell>
              );
            })}
          </View>
        );
      }
      // if there are no objectKeys, just display the elements in data
      return (
        <View style={[{ height, width }, styles.row, rowStyle, top3Style]}>
          {data.map((data, i) => {
            const cellFlex = flexArray ? flexArray[i] : widthArray ? null : 1;
            const cellWidth = widthArray
              ? widthArray[i]
              : totalwidth / data.length;
            return (
              <Cell
                key={i}
                data={data}
                height={height}
                width={cellWidth}
                flex={cellFlex}
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

export class Rows extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    objectKeys: PropTypes.array,
    totalheight: PropTypes.number.isRequired,
    totalwidth: PropTypes.number,
    widthArray: PropTypes.array,
    flexArray: PropTypes.array,
    rowStyle: PropTypes.object,
    top3Styling: PropTypes.bool,
  };
  render() {
    const {
      data,
      objectKeys,
      totalheight,
      heightArray,
      totalwidth,
      widthArray,
      flexArray,
      rowsStyle,
      top3Styling,
      ...props
    } = this.props;

    const height = totalheight ? totalheight : sum(heightArray);
    const width = totalwidth ? totalwidth : sum(widthArray);

    if (data) {
      return (
        <View
          style={{
            width,
            height,
            ...rowsStyle,
            ...styles.rows,
          }}
        >
          {data.map((row, index) => {
            const rowHeight = heightArray
              ? heightArray[index]
              : totalheight / data.length;

            const top3StylingIndex = top3Styling ? index : 999;

            return (
              <Row
                key={index}
                data={row}
                objectKeys={objectKeys}
                height={rowHeight}
                totalwidth={totalwidth}
                widthArray={widthArray}
                flexArray={flexArray}
                top3StylingIndex={top3StylingIndex}
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
