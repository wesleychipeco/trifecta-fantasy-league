// index.js - WEB
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MenuProvider>
        <App />
      </MenuProvider>
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
