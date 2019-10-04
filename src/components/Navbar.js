import React, { PureComponent } from "react";
import { View } from "react-native";
import { StandingsDropdownPre2019 } from "./StandingsDropdownPre2019";
import { StandingsDropdownPost2019 } from "./StandingsDropdownPost2019";
import { MyButton } from "./MyButton";
import { navbarStyles as styles } from "../styles/globalStyles";

export class Navbar extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <MyButton
          title="Home"
          onPress={() => navigation.navigate("Home")}
          touchableStyles={styles.button}
          textStyles={styles.text}
        />
        <StandingsDropdownPost2019 year="2019" navigation={navigation} />
        <StandingsDropdownPre2019
          year1="2017"
          year2="2018"
          navigation={navigation}
        />
        <StandingsDropdownPre2019
          year1="2016"
          year2="2017"
          navigation={navigation}
        />
        <StandingsDropdownPre2019
          year1="2015"
          year2="2016"
          navigation={navigation}
        />
        <MyButton
          title="2018 Football Standings"
          onPress={() =>
            navigation.navigate("FootballStandings", { year: "2018" })
          }
          touchableStyles={styles.button}
          textStyles={styles.text}
        />
      </View>
    );
  }
}
