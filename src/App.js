// App.js - WEB
import React, { Component } from "react";
import { STITCH_APP_ID } from "./consts/StitchConstants";

import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import { AppRouter } from "./AppRouter";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      client: undefined,
    };

    this._loadClient = this._loadClient.bind(this);
  }

  componentDidMount() {
    this._loadClient();
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient(STITCH_APP_ID).then((client) => {
      this.setState({ client });
      this.state.client.auth
        .loginWithCredential(new AnonymousCredential())
        .then((user) => {
          console.log(`Successfully logged in as user ${user.id}`);
          this.setState({ currentUser: user.id });
          this.setState({ currentUser: client.auth.user.id });
        })
        .catch((err) => {
          console.log(`Failed to login anonymously: ${err}`);
          this.setState({ currentUser: undefined });
        });
    });
  }

  render() {
    return (
      <div style={{ height: "100vh", width: "100vw" }}>
        <AppRouter />
      </div>
    );
  }
}

export default App;
