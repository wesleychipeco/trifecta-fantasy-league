// index.js - WEB
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";
import { Auth0Provider } from "@auth0/auth0-react";
import store from "./store";

ReactDOM.render(
  <Auth0Provider
    domain="dev--a9elj87.us.auth0.com"
    clientId="VgjPp8ZToYg4rKiatitaxVXUAJAhTotw"
    redirectUri={window.location.origin}
  >
    <Provider store={store}>
      <Router>
        <MenuProvider>
          <App />
        </MenuProvider>
      </Router>
    </Provider>
  </Auth0Provider>,
  document.getElementById("root")
);
registerServiceWorker();
