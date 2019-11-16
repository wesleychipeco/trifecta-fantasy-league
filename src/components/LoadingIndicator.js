import React, { PureComponent } from "react";
import { View, Animated, Text, Easing } from "react-native";
import { loadingIndicatorStyles as styles } from "../styles/globalStyles";

class LoadingIndicator extends PureComponent {
  constructor() {
    super();
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.spin();
  }

  spin = () => {
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear
    }).start(() => this.spin());
  };

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    const loadingIndicatorStyles = {
      ...styles.loadingImage,
      transform: [{ rotate: spin }]
    };

    return (
      <View style={styles.container}>
        <Animated.Image
          style={loadingIndicatorStyles}
          source={require("../resources/images/spinner.jpg")}
        />
        <Text style={styles.loadingText}>Loading . . .</Text>
      </View>
    );
  }
}

export { LoadingIndicator };
