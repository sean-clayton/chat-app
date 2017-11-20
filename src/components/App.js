import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import { AuthProvider } from "./Auth";
import { ChatProvider, ChatMessages } from "./Chat";

class App extends React.Component {
  async componentDidMount() {
    await this.props.login();
  }
  render() {
    return (
      <div>
        <p>{this.props.username}</p>
        <ChatProvider>
          <ChatMessages />
        </ChatProvider>
      </div>
    );
  }
}

export default () => (
  <AuthProvider render={authUtils => <App {...authUtils} />} />
);
