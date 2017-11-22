import React from "react";
import g, { Ul } from "glamorous";
import { AuthProvider } from "./Auth";
import {
  ChatProvider,
  ChatMessages,
  ChatForm,
  ChatInput,
  ChatSubmit
} from "./Chat";

const MainContent = g.main({
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(0,0,0,.1)",
  borderRadius: ".25em",
  minHeight: "24em",
  minWidth: "24em"
});

const ChatHeader = g.header({
  backgroundColor: "#07f",
  color: "#fff",
  padding: "1em",
  borderRadius: ".25em .25em 0 0",
  boxShadow: "inset 0 -1px 0 rgba(0,0,0,.1)"
});

class App extends React.Component {
  async componentDidMount() {
    await this.props.login();
  }

  render() {
    return (
      <MainContent>
        <ChatHeader>
          {this.props.username ? this.props.username : "Logging In..."}
        </ChatHeader>
        <ChatProvider username={this.props.username}>
          <ChatMessages
            render={messages => (
              <Ul
                css={{
                  display: "flex",
                  flex: 1
                }}
              >
                {messages.length
                  ? messages.map(msg => (
                      <li key={msg.id}>
                        {msg.attributes.message} {msg.attributes.created_at}
                      </li>
                    ))
                  : "Loading messages..."}
              </Ul>
            )}
          />
          <ChatForm disabled={this.props.username === null}>
            <ChatInput
              placeholder={this.props.username ? "Type here" : "Logging In..."}
            />
            <ChatSubmit cta css={{ marginLeft: "1em" }} />
          </ChatForm>
        </ChatProvider>
      </MainContent>
    );
  }
}

export default () => (
  <AuthProvider render={authUtils => <App {...authUtils} />} />
);
