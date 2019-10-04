import { StyleSheet } from "react-native";

const cellStyles = StyleSheet.create({
  cell: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

const rowStyles = StyleSheet.create({
  rows: {
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
});

const linkTextStyles = StyleSheet.create({
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

const myButtonStyles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontFamily: "Arial",
  },
});

const homeScreenStyles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  header: {
    width: "80%",
    marginTop: 20,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
  },
  caption: {
    textAlign: "center",
    fontSize: 16,
  },
  timeline: {
    alignSelf: "center",
  },
  future: {
    marginVertical: 20,
    width: "80%",
  },
  item: {
    fontSize: 16,
    alignSelf: "flex-start",
    textAlign: "center",
  },
  googleDoc: {
    width: "80%",
    height: 750,
    style: {
      alignSelf: "center",
    },
  },
});

const standingsStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
  subtext: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 14,
  },
  tables: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  table: {
    alignItems: "center",
    marginVertical: 10,
  },
  header: {
    backgroundColor: "#BEBEBE",
  },
  headerText: {
    color: "#0041C2",
  },
});

const navbarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#cccccc",
    width: "100%",
  },
  button: {
    borderWidth: 3,
    borderColor: "#000",
    backgroundColor: "#007FFF",
    padding: 5,
  },
  text: {
    color: "#FFFFFF",
  },
});

/*
  - triggerOuterWrapper
  - triggerWrapper
  - triggerText
  - triggerTouchable
*/
const triggerStyles = StyleSheet.create({
  triggerOuterWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007FFF",
    borderWidth: 3,
    borderColor: "#000000",
    padding: 5,
  },
  triggerText: {
    fontFamily: "Arial",
    color: "white",
  },
});

/*
- optionsWrapper
- optionsContainer
- optionWrapper
- optionText
- optionTouchable
*/
const optionsStyles = StyleSheet.create({
  optionsWrapper: {
    borderWidth: 3,
    borderColor: "#000000",
  },
  optionWrapper: {
    backgroundColor: "#DCDCDC",
  },
  optionText: {
    fontFamily: "Arial",
  },
});

export {
  cellStyles,
  rowStyles,
  linkTextStyles,
  myButtonStyles,
  homeScreenStyles,
  standingsStyles,
  navbarStyles,
  triggerStyles,
  optionsStyles,
};
