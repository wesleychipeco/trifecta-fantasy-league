const cellStyles = {
  cell: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    backgroundColor: "transparent",
    textAlign: "center",
  },
};

const rowStyles = {
  rows: {
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
};

const linkTextStyles = {
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
};

const myButtonStyles = {
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontFamily: "Arial",
  },
};

const loadingIndicatorStyles = {
  container: {
    top: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImage: {
    width: 150,
    height: 150,
    marginBottom: 25,
  },
  loadingText: {
    fontSize: 24,
  },
};

const homeScreenStyles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  header: {
    width: "80%",
    marginTop: 20,
  },
  trifectaBanner: {
    height: 250,
    width: "100%",
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
  },
  caption: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
  googleDoc: {
    width: "80%",
    height: 750,
    style: {
      alignSelf: "center",
    },
  },
  commissionerButton: {
    position: "absolute",
    width: 60,
    height: 30,
    backgroundColor: "transparent",
    top: 60,
    left: 440,
  },
};

const commissionerStyles = {
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 5,
  },
  subtext: {
    marginBottom: 5,
    fontSize: 14,
  },
  commissionerButton: {
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#007FFF",
    padding: 5,
  },
  commissionerButtonText: {
    color: "#FFFFFF",
  },
  overlayBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  overlayContainer: {
    width: 400,
    height: 150,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  matchupsScrapeOverlayTitle: {
    fontSize: 24,
    marginBottom: 12,
  },
  matchupsScrapeOverlayText: {
    fontSize: 16,
    marginBottom: 6,
  },
  matchupsScrapeOverlayButton: {
    width: "50%",
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#007FFF",
    padding: 5,
    alignSelf: "center",
  },
};

const standingsStyles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  dropdown: {
    position: "absolute",
    right: 250,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 5,
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
};

const navbarStyles = {
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#cccccc",
    width: "100%",
  },
  button: {
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#007FFF",
    padding: 5,
  },
  text: {
    color: "#FFFFFF",
  },
};

/*
  - triggerOuterWrapper
  - triggerWrapper
  - triggerText
  - triggerTouchable
*/
const triggerStyles = {
  triggerOuterWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007FFF",
    // borderWidth: 3,
    // borderColor: "#000000",
    padding: 5,
  },
  triggerText: {
    fontFamily: "Arial",
    color: "white",
  },
};

/*
- optionsWrapper
- optionsContainer
- optionWrapper
- optionText
- optionTouchable
*/
const optionsStyles = {
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
};

export {
  cellStyles,
  rowStyles,
  linkTextStyles,
  myButtonStyles,
  loadingIndicatorStyles,
  homeScreenStyles,
  standingsStyles,
  commissionerStyles,
  navbarStyles,
  triggerStyles,
  optionsStyles,
};
