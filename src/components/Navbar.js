import React, { PureComponent } from "react";
import { View } from "react-native";
import { useAuth0 } from "@auth0/auth0-react";
import { StandingsDropdownPost2019 } from "./StandingsDropdownPost2019";
import { MyButton } from "./MyButton";
import { navbarStyles as styles } from "../styles/globalStyles";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

export const Navbar = (navigation) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log("U", user);
  console.log("isAuth", isAuthenticated);
  console.log("isloading", isLoading);
  if (isLoading) {
    return <div>LOADING...</div>;
  }
  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <div
          style={{
            display: "flex",
            backgroundColor: "red",
            flexDirection: "row",
          }}
        >
          {`Hello, ${user && user.name}`}
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
      <MyButton
        title="Home"
        onPress={() => navigation.navigate("Home")}
        touchableStyles={styles.button}
        textStyles={styles.text}
      />
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
};

// export class Navbar extends PureComponent {
//   message = () => {
//     const {user, isAuthenticated, isLoading} = useAuth0();
//     console.log('U', user);
//     console.log('isAuth', isAuthenticated);
//     console.log('isloading', isLoading);
//   }

//   message();

//   render() {
//     // const { loginWithRedirect } = useAuth0();
//     const { navigation } = this.props;
//     return (
//       <View style={styles.container}>
//         <LoginButton />
//         <LogoutButton />
//         {/* <MyButton title="Login" onClick={() => loginWithRedirect()} /> */}
//         <MyButton
//           title="Home"
//           onPress={() => navigation.navigate("Home")}
//           touchableStyles={styles.button}
//           textStyles={styles.text}
//         />
//         {/* <MyButton
//           title="2022 Basketball Standings"
//           onPress={() =>
//             navigation.navigate("BasketballStandings", { year: "2022" })
//           }
//           touchableStyles={{
//             borderWidth: 2,
//             borderColor: "#000000",
//             backgroundColor: "#007FFF",
//             padding: 5,
//           }}
//           textStyles={{ color: "#FFFFFF" }}
//         /> */}
//         <StandingsDropdownPost2019 year="2022" navigation={navigation} />
//         <MyButton
//           title="Trifecta Standings"
//           onPress={() => navigation.navigate("StandingsHomeScreen")}
//           touchableStyles={styles.button}
//           textStyles={styles.text}
//         />
//         <MyButton
//           title="Trade History"
//           onPress={() => navigation.navigate("TradeHistory")}
//           touchableStyles={styles.button}
//           textStyles={styles.text}
//         />
//         <MyButton
//           title="Hall Of Fame"
//           onPress={() => navigation.navigate("HallOfFameHomeScreen")}
//           touchableStyles={styles.button}
//           textStyles={styles.text}
//         />
//         <MyButton
//           title="Owner Matchups"
//           onPress={() => navigation.navigate("MatchupsHomeScreen")}
//           touchableStyles={styles.button}
//           textStyles={styles.text}
//         />
//         <MyButton
//           title="Owner Profiles"
//           onPress={() => navigation.navigate("OwnerProfilesHomeScreen")}
//           touchableStyles={styles.button}
//           textStyles={styles.text}
//         />
//         {/* <MyButton
//           title="Scrape Matchups"
//           onPress={() =>
//             navigation.navigate("MatchupsScraper", { year: "2021" })
//           }
//           touchableStyles={{
//             borderWidth: 2,
//             borderColor: "#000000",
//             backgroundColor: "#007FFF",
//             padding: 5,
//           }}
//           textStyles={{ color: "#FFFFFF" }}
//         /> */}
//       </View>
//     );
//   }
// }
