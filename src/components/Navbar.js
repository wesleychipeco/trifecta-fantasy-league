import React, { PureComponent } from "react";
import { View } from "react-native";
import { Link } from "react-router-dom";
// import { StandingsDropdownPost2019 } from "./StandingsDropdownPost2019";
import { navbarStyles as styles } from "../styles/globalStyles";
import { BASE_ROUTES, ROUTES } from "../Routes";

export class Navbar extends PureComponent {
  render() {
    console.log("hi");
    return (
      <View style={styles.container}>
        <Link to={ROUTES.Home}>Home Link</Link>
        <Link to={ROUTES.StandingsHomeScreen}>Standings Home Page Link</Link>
        <Link to={ROUTES.TradeHistory}>TradeHistory Link</Link>
        <Link to={ROUTES.HallOfFameHomeScreen}>HallOfFame Link</Link>
        <Link to={ROUTES.MatchupsHomeScreen}>MatchupsHomeScreen Link</Link>
        <Link to={ROUTES.OwnerProfilesHomeScreen}>
          OwnerProfilesHomeScreen Link
        </Link>
        <Link to={`${BASE_ROUTES.BasketballStandings}/2022`}>
          2022 Basketball Standings Link
        </Link>
        {/* <MyButton
          title="2022 Basketball Standings"
          onPress={() =>
            navigation.navigate("BasketballStandings", { year: "2022" })
          }
          touchableStyles={{
            borderWidth: 2,
            borderColor: "#000000",
            backgroundColor: "#007FFF",
            padding: 5,
          }}
          textStyles={{ color: "#FFFFFF" }}
        /> */}
        {/* <StandingsDropdownPost2019 year="2022" navigation={navigation} /> */}
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
