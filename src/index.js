// index.js - WEB
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import store from "./store";
import BaseballStandings from "./BaseballStandings";

ReactDOM.render(
  <Provider store={store}>
    <BaseballStandings />
    {/* <Router>
      <App />
    </Router> */}
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
