import React, { PureComponent } from "react";
import { View } from "react-native";
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
        <MyButton
          title="2023 Basketball Standings"
          onPress={() =>
            navigation.navigate("BasketballStandings", { year: "2023" })
          }
          touchableStyles={{
            borderWidth: 2,
            borderColor: "#000000",
            backgroundColor: "#007FFF",
            padding: 5,
          }}
          textStyles={{ color: "#FFFFFF" }}
        />
        <StandingsDropdownPost2019 year="2022" navigation={navigation} />
        <MyButton
          title="Trifecta Standings"
          onPress={() => navigation.navigate("StandingsHomeScreen")}
          touchableStyles={styles.button}
          textStyles={styles.text}
        />
        <MyButton
          title="Trade History"
          onPress={() => navigation.navigate("TradeHistory")}
          touchableStyles={styles.button}
          textStyles={styles.text}
        />
        <MyButton
          title="Hall Of Fame"
          onPress={() => navigation.navigate("HallOfFameHomeScreen")}
          touchableStyles={styles.button}
          textStyles={styles.text}
        />
        <MyButton
          title="Owner Matchups"
          onPress={() => navigation.navigate("MatchupsHomeScreen")}
          touchableStyles={styles.button}
          textStyles={styles.text}
        />
        <MyButton
          title="Owner Profiles"
          onPress={() => navigation.navigate("OwnerProfilesHomeScreen")}
          touchableStyles={styles.button}
          textStyles={styles.text}
        />
        {/* <MyButton
          title="Scrape Matchups"
          onPress={() =>
            navigation.navigate("MatchupsScraper", { year: "2021" })
          }
          touchableStyles={{
            borderWidth: 2,
            borderColor: "#000000",
            backgroundColor: "#007FFF",
            padding: 5,
          }}
          textStyles={{ color: "#FFFFFF" }}
        /> */}
      </View>
    );
  }
}
