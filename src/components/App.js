import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import { AuthProvider } from "./Auth";
import { ChatProvider, ChatMessages } from "./Chat";

class AppWrapper extends React.Component {
  async componentDidMount() {
    await this.props.login();
  }
  render() {
    const { username } = this.props;
    return (
      <div>
        <p>{username}</p>
        <ChatProvider>
          <ChatMessages />
        </ChatProvider>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return <AuthProvider render={authUtils => <AppWrapper {...authUtils} />} />;
  }
}

export default App;
