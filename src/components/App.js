import React from "react";
import { AuthProvider } from "./Auth";
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
        <p>{this.props.username}</p>
        <ChatProvider>
          <ChatMessages />
          <ChatForm>
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
