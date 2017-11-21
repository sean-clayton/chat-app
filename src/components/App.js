import React from "react";
import { AuthProvider, LogoutButton, LoginButton } from "./Auth";
import {
  ChatProvider,
  ChatMessages,
  ChatForm,
  ChatInput,
  ChatSubmit
} from "./Chat";

class App extends React.Component {
  async componentDidMount() {
    await this.props.login();
  }
  render() {
    return (
      <div>
        {this.props.username ? (
          <LogoutButton logout={this.props.logout} />
        ) : (
          <LoginButton login={this.props.login} />
        )}
        <p>{this.props.username}</p>
        <ChatProvider username={this.props.username}>
          <ChatMessages />
          <ChatForm disabled={this.props.username === null}>
            <ChatInput />
            <ChatSubmit />
          </ChatForm>
        </ChatProvider>
      </div>
    );
  }
}

export default () => (
  <AuthProvider render={authUtils => <App {...authUtils} />} />
);
